import mongoose from "mongoose";
import Application from "./models/Application";

module.exports = async () => {
    await Application.deleteMany({});
    await mongoose.connection.close();
}