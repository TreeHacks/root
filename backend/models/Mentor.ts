import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { ICheckInInfo } from "./Application.d";
import { IMealInfo } from "./Application.d";
import checkInSchema from "./checkInSchema";
import mealInfoSchema from "./mealInfoSchema";

interface IMentor extends mongoose.Document {
    _id: string,
    year: string,
    forms: {
        application_info: {
            first_name: string,
            last_name: string
        },
        check_in_info: ICheckInInfo,
        meal_info: IMealInfo
    },
    user: {
        id: string,
        email: string
    }
}

const mentorSchema: Schema = new mongoose.Schema({
    "_id": String,
    "year": String,
    "forms": {
        "application_info": {
            "first_name": String,
            "last_name": String
        },
        "check_in_info": checkInSchema,
        "meal_info": mealInfoSchema
    },
    "user": {
        "id": String,
        "email": String
    }
});

const model: Model<IMentor> = mongoose.model("Mentor", mentorSchema);
export default model;
