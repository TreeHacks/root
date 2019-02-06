import { Request, Response } from 'express';
import { AVAILABLE_ROOMS } from "../constants";
import RoomReservation from "../models/RoomReservation";

const RESERVATION_LENGTH = 1 * 60 * 60 * 1000; // 1 hour

export async function getPublicRoomStatus(req: Request, res: Response) {
  const room = AVAILABLE_ROOMS.find(r => r.id === req.query.id);

  if (!room) {
    res.status(500).json({ message: "Room not found" });
  }

  const currentReservation = await RoomReservation.findOne({
    room_id: req.query.id,
    expiry: { $gte: Date.now() }
  });

  res.json(Object.assign({}, room, {
    expiry: currentReservation ? currentReservation.expiry : null
  }));
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

      return Object.assign({}, r, {
        expiry: currentReservations[r.id] ? currentReservations[r.id].expiry : null,
        error: hasRecentlyReserved ? "you've already reserved this room rather recently" : null
      });
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

    const reservation = new RoomReservation({
      room_id: req.body.room,
      user: res.locals.user.sub,
      expiry: Date.now() + RESERVATION_LENGTH
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
