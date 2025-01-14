// Push notifications for TreeHacks Live

import { Request, Response } from 'express';
import { PushSubscription } from 'web-push';
import axios from 'axios';
import LiveNotificationSubscription from '../models/LiveNotificationSubscription';
import { EventiveResponse } from '../services/live_notifications';

const EVENTS_API_URL = `https://api.eventive.org/event_buckets/${process.env.EVENTIVE_EVENT_BUCKET}/events?api_key=${process.env.EVENTIVE_API_KEY}`;

async function getEvent(eventId: string) {
  const req = await axios.get<EventiveResponse>(EVENTS_API_URL);
  const events = req.data.events;
  return events.find((evt) => evt.id === eventId);
}

async function getSubscriptions(endpoint: string) {
  const subscriptions = await LiveNotificationSubscription.find({
    'subscription.endpoint': endpoint,
  });
  return subscriptions.map((sub) => sub.eventId);
}

export async function getEventSubscriptions(req: Request, res: Response) {
  const endpoint = req.query.endpoint;

  if (endpoint == null) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  const events = await getSubscriptions(endpoint);
  return res.json(events);
}

export async function createEventPushSubscription(req: Request, res: Response) {
  const sub: PushSubscription | null = req.body.subscription;
  const eventId = req.body.eventId;

  if (
    sub == null ||
    sub.endpoint == null ||
    sub.keys == null ||
    sub.keys.auth == null ||
    sub.keys.p256dh == null ||
    eventId == null
  ) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  const event = await getEvent(eventId);
  if (!event) {
    return res.status(400).json({ error: 'Event not found' });
  }

  const existingSub = await LiveNotificationSubscription.findOne({
    'subscription.endpoint': sub.endpoint,
    eventId,
  });

  if (existingSub != null) {
    return res.status(400).json({ error: 'Subscription already exists' });
  }

  await new LiveNotificationSubscription({ subscription: sub, eventId }).save();

  // Return the user's updated list of subscribed events
  const events = await getSubscriptions(sub.endpoint);
  return res.json({ subscriptions: events });
}

export async function deleteEventPushSubscription(req: Request, res: Response) {
  const sub = req.body.subscription;
  const eventId = req.body.eventId;

  if (sub == null || sub.endpoint == null || eventId == null) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  await LiveNotificationSubscription.findOneAndDelete({
    'subscription.endpoint': sub.endpoint,
    eventId,
  });

  const events = await getSubscriptions(sub.endpoint);
  return res.json({ subscriptions: events });
}
