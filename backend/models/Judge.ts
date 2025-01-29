import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface IJudge extends mongoose.Document {
    _id: string,
    year: string,
    forms: {
        application_info: {
            first_name: string,
            last_name: string
        },
        check_in_info: {
            tshirtSize: string
        },
        meal_info: {
            usedMeals: string[],
            dietaryRestrictions: string
        }
    },
    user: {
        id: string,
        email: string
    }
}

const judgeSchema: Schema = new mongoose.Schema({
    "_id": String,
    "year": String,
    "forms": {
        "application_info": {
            "first_name": String,
            "last_name": String
        },
        "check_in_info": {
            "tshirtSize": String
        },
        "meal_info": {
            "usedMeals": [String],
            "dietaryRestrictions": String
        }
    },
    "user": {
        "id": String,
        "email": String
    }
});

const model: Model<IJudge> = mongoose.model("Judge", judgeSchema);
export default model;