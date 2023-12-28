import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetInfoSchema: Schema = new mongoose.Schema({
    mealList: String,
}, { _id: false });

export default usedMealsSchema;
