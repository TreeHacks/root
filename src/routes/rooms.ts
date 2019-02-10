import { Request, Response } from 'express';
import chrono from 'chrono-node';
import { AVAILABLE_ROOMS } from "../constants";
import RoomReservation from "../models/RoomReservation";
import Application from "../models/Application";

AVAILABLE_ROOMS.forEach(r => {
  r.unavailable = r.unavailable.map(({ start, end, ...rest }) => {
    return { ...rest, start: chrono.parseDate(start), end: chrono.parseDate(end) };
  });
});

const RESERVATION_LENGTH = 1 * 60 * 60 * 1000; // 1 hour

function getAvailability(room) {
  const now = Date.now();
  return {
    current_unavailable: room.unavailable.find(({ start, end }) => start <= now && now <= end),
    next_unavailable: room.unavailable.find(({ start }) => start >= now && start - now <= RESERVATION_LENGTH)
  };
}

export async function getPublicRoomStatus(req: Request, res: Response) {
  const room = AVAILABLE_ROOMS.find(r => r.id === req.query.id);

  if (!room) {
    return res.status(500).json({ message: "Room not found" });
  }

  let expiry, reserver;

  const currentReservation = await RoomReservation.findOne({
    room_id: req.query.id,
    expiry: { $gte: Date.now() }
  });
  if (currentReservation) {
    expiry = currentReservation.expiry;

    // Inject reserver first name for display
    const application = await Application.findOne({ _id: currentReservation.user });
    if (application) {
      reserver = application.forms.application_info.first_name;
    }
  }

  const availability = getAvailability(room);
  if (availability.current_unavailable) { expiry = availability.current_unavailable.end; }

  res.json({
    id: room.id,
    name: room.name,
    description: room.description,
    expiry,
    reserver
  });
}

export async function getRooms(req: Request, res: Response) {
  try {
    const now = Date.now();

    const currentReservations = (await RoomReservation.find({
      room_id: { $exists: true },
      expiry: { $gte: now }
    }).sort('-expiry').lean()).reduce((d, r) => { d[r.room_id] = r; return d; }, {});

    const userReservations = await RoomReservation.find({
      room_id: { $exists: true },
      user: res.locals.user.sub
    }).sort('-expiry').lean();

    let userCurrentReservation;
    if (userReservations.length && userReservations[0].expiry > now) {
      userCurrentReservation = userReservations[0];
    }

    const rooms = AVAILABLE_ROOMS.map(r => {
      const hasRecentlyReserved = userReservations.some(userReservation => (
        userReservation.room_id === r.id && Math.abs(now - userReservation.expiry) < RESERVATION_LENGTH));

      const availability = getAvailability(r);

      return {
        id: r.id,
        name: r.name,
        description: r.description,
        expiry: availability.current_unavailable ? availability.current_unavailable.end :
          currentReservations[r.id] ? currentReservations[r.id].expiry : null,
        error: availability.current_unavailable ? `this room is in use for "${availability.current_unavailable.label}" until %EXPIRY%` :
          hasRecentlyReserved ? "you've already reserved this room rather recently" : null,
        next_unavailable: availability.next_unavailable
      };
    });

    res.json({
      current_room: userCurrentReservation ? rooms.find(r => r.id === userCurrentReservation.room_id) : null,
      rooms: rooms
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function reserveRoom(req: Request, res: Response) {
  try {
    const existing = await RoomReservation.findOne({
      expiry: { $gte: Date.now() },
      room_id: { $exists: true },
      $or: [
        { room_id: req.body.room }, // room is already reserved
        { user: res.locals.user.sub } // already has a reservation out
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "aw shucks, the room has already been reserved :(" });
    }

    const room = AVAILABLE_ROOMS.find(r => r.id === req.body.room);
    const availability = getAvailability(room);
    if (availability.current_unavailable) {
      return res.status(400).json({ message: "oh no! this room is currently in use for a super-special treehacks activity :(" });
    }

    // Only allow reserving up til the next unavailable block
    let expiry = Date.now() + RESERVATION_LENGTH;
    if (availability.next_unavailable) {
      expiry = Math.min(expiry, availability.next_unavailable.start)
    }

    const reservation = new RoomReservation({
      room_id: req.body.room,
      user: res.locals.user.sub,
      expiry: expiry
    });
    await reservation.save();

    // return updated list
    return getRooms(req, res);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function dropCurrentRoom(req: Request, res: Response) {
  try {
    await RoomReservation.findOneAndUpdate({
      expiry: { $gte: Date.now() },
      user: res.locals.user.sub
    }, {
      $set: {
        expiry: Date.now()
      }
    });

    // return updated list
    return getRooms(req, res);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
