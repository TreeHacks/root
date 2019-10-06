import mongoose, { Model } from "mongoose";
import { applicationSchema } from "./Application";
import { IApplication } from "./Application.d";
import { HACKATHON_YEAR_STRING } from "../constants";

const applicationCurrentYearSchema = applicationSchema.clone();

applicationCurrentYearSchema.pre('aggregate', function (this: mongoose.Aggregate<IApplication>) {
    this.pipeline().unshift({
        "$match": {
            year: HACKATHON_YEAR_STRING,
        }
    })
});

applicationCurrentYearSchema.pre('find', projectCurrentYear);
applicationCurrentYearSchema.pre('findOne', projectCurrentYear);

export function projectCurrentYear(this: mongoose.Query<IApplication>) {
    let query = this.getQuery();
    this.setQuery({ ...query, year: HACKATHON_YEAR_STRING });
}

async function setCurrentYear(this: mongoose.Document) {
    if (!(this as any).year) {
        (this as any).year = HACKATHON_YEAR_STRING;
    }
}

const model: Model<IApplication> = mongoose.model("Application", applicationSchema, "Application");
export default model;