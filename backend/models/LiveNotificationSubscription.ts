import mongoose from 'mongoose';
import { Model, Schema } from 'mongoose';
import { PushSubscription } from 'web-push';

// This model stores push notification subscriptions for use in TreeHacks Live.
interface LiveNotificationSubscription extends mongoose.Document {
  _id: string;
  eventId: string;
  subscription: PushSubscription;
  // Potentially add user or other fields here eventually.
}

const liveSubscriptionSchema: Schema = new mongoose.Schema({
  eventId: String,
  subscription: {
    endpoint: String,
    expirationTime: Number,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
});

const model: Model<LiveNotificationSubscription> = mongoose.model(
  'LiveNotificationSubscription',
  liveSubscriptionSchema
);
export default model;
