import mongoose from "mongoose";
import Application from "./models/Application";

jest.setTimeout(30000);

module.exports = async () => {
    await Application.deleteMany({});
    await mongoose.connection.close();
}