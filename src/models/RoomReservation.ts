import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface IRoomReservation extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId,
    room_id: string,
    user: string,
    expiry: Date
};

const roomReservationSchema: Schema = new mongoose.Schema({
    "_id": { type: mongoose.Schema.Types.ObjectId, auto: true },
    "room_id": String,
    "user": String,
    "expiry": Date
});

const model: Model<IRoomReservation> = mongoose.model("RoomReservation", roomReservationSchema);
export default model;
