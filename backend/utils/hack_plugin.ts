import mongoose from 'mongoose';
import { IHack } from '../models/Hack.d';
import {get} from "lodash";
import { hackReviewDisplayFields } from '../constants';

export default function hackPlugin(schema: mongoose.Schema) {
    schema.pre('find', projectAllowedHackFields);
    // schema.pre('findOne', projectAllowedHackFields); // todo: this can't be enabled; otherwise a judge cannot add their review.
    schema.pre('countDocuments', function (next) {
        projectAllowedHackFields.call(this as mongoose.Query<IHack>);
      next();
    });
    // schema.post('findOne', injectDynamicApplicationContent);
  }


/*
 * Only filter by allowed applications and fields.
 * 
 * For example, only admins can view all fields.
 * Sponsors can only view certain fields, and can only view admitted people who have not opted out.
 * 
 * This is run on the find hook (aggregate view for admins, judges, and everyone)
 * and findOne hook (admin table view)
 */
export function projectAllowedHackFields(this: mongoose.Query<IHack>) {
    let query = this.getQuery();
    const options = this.getOptions();
    let groups = get(options, "treehacks:groups", []);
    if (groups.indexOf("admin") > -1) {
    }
    else {
        this.select(hackReviewDisplayFields.join(" "));
    }
  }