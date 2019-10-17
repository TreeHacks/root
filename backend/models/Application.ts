import mongoose, { Model } from "mongoose";
import { applicationSchema } from "./ApplicationAnyYear";
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
applicationCurrentYearSchema.pre('save', setCurrentYear);

function projectCurrentYear(this: mongoose.Query<IApplication>) {
    let query = this.getQuery();
    this.setQuery({ ...query, year: HACKATHON_YEAR_STRING });
}

function setCurrentYear(this: IApplication) {
    if (!this.year) {
        this.year = HACKATHON_YEAR_STRING;
    }
}

const model: Model<IApplication> = mongoose.model("Application", applicationCurrentYearSchema, "Application");
export default model;