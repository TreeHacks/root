// The push notifications service for TreeHacks Live
// Sends a "begins in 5 minutes" and "starting now" notification for upcoming events

import axios from 'axios';
import { sendNotification, setVapidDetails } from 'web-push';
import LiveNotificationSubscription from '../models/LiveNotificationSubscription';

setVapidDetails(
  'mailto:hello@treehacks.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string[];
  updated_at: string;
}

interface NotificationQueueItem {
  eventId: string;
  time: number;
  type: 'SOON' | 'NOW';
}

export interface EventiveResponse {
  events: Event[];
}

const FIVE_MINUTES = 5 * 60 * 1000;

export default class LiveNotificationsService {
  eventiveUrl: string;
  events: Event[];
  notificationQueue: NotificationQueueItem[];
  timeoutId: NodeJS.Timeout | null;

  constructor() {
    this.eventiveUrl = `https://api.eventive.org/event_buckets/${process.env.EVENTIVE_EVENT_BUCKET}/events?api_key=${process.env.EVENTIVE_API_KEY}`;

    this.events = [];
    this.notificationQueue = [];
    this.timeoutId = null;
  }

  async start() {
    await this.fetchEvents();

    // Fetch events every 10 minutes
    setInterval(this.fetchEvents.bind(this), 2 * FIVE_MINUTES);
  }

  async fetchEvents() {
    const req = await axios.get<EventiveResponse>(this.eventiveUrl);

    if (req == null || req.status !== 200) {
      return;
    }

    // The API returns the events in sorted order
    const events = req.data.events;
    this.events = events;

    // Clear the existing notification queue
    this.notificationQueue = [];

    // Put all future events into the queue
    const futureEvents = events.filter(
      (evt) => new Date(evt.start_time) > new Date()
    );

    for (const evt of futureEvents) {
      const startTime = new Date(evt.start_time).getTime();

      // If there's more than 5 minutes until the event starts,
      // enqueue the "starts in 5 minutes" notification
      if (startTime - Date.now() > FIVE_MINUTES) {
        this.notificationQueue.push({
          eventId: evt.id,
          time: startTime - FIVE_MINUTES,
          type: 'SOON',
        });
      }

      this.notificationQueue.push({
        eventId: evt.id,
        time: startTime,
        type: 'NOW',
      });
    }

    // Sort the notification queue
    this.notificationQueue.sort((a, b) => a.time - b.time);

    // Start the timeout for the next notification
    this.startTimeout();
  }

  startTimeout() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }

    if (this.notificationQueue.length === 0) {
      return;
    }

    const nextNotification = this.notificationQueue[0];
    const delay = nextNotification.time - Date.now();

    this.timeoutId = setTimeout(() => {
      this.sendNotificationsForEvent(nextNotification);

      // Remove the notification from the queue
      this.notificationQueue.shift();

      // Start the next timeout
      this.startTimeout();
    }, delay);
  }

  async sendNotificationsForEvent(notification: NotificationQueueItem) {
    const event = this.events.find((evt) => evt.id === notification.eventId);

    if (event == null) {
      return;
    }

    // Get all devices subscribed to the event
    const subscriptions = await LiveNotificationSubscription.find({
      eventId: notification.eventId,
    });
    const data = {
      title: event.name,
      body: `is starting ${notification.type === 'SOON' ? 'in 5 min' : 'now'}${
        event.location != null ? ` at ${event.location}` : ''
      }.`,
    };
    const payload = JSON.stringify(data);

    // Send all of the notification requests at once
    const promises = subscriptions.map((sub) =>
      sendNotification(sub.subscription, payload)
    );
    const result = await Promise.all(promises);
    const failed = result.filter((r) => r.statusCode !== 201);
    console.log(
      `Sent ${promises.length} notifications for ${event.name}, ${failed.length} failed`
    );
  }
}
