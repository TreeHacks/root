import { uploadBase64Content, generateSignedUrlForFile } from '../services/file_actions';
import mongoose from 'mongoose';
import { get, set } from "lodash";
import { IApplication } from '../models/Application.d';
import { STATUS, sponsorApplicationDisplayFields, HACKATHON_YEAR_STRING } from '../constants';

// Paths on the application that store file data that should be uploaded to S3.
const APPLICATION_FILE_PATHS = ["forms.application_info.resume", "forms.transportation.receipt"];

export default function s3FilePlugin(schema: mongoose.Schema) {
  schema.pre('save', uploadDynamicApplicationContent);
  schema.pre('find', projectAllowedApplicationFields);
  schema.pre('findOne', projectAllowedApplicationFields);
  schema.pre('countDocuments', function (next) {
    projectAllowedApplicationFields.call(this as mongoose.Query<IApplication>);
    next();
  });
}

async function uploadDynamicApplicationContent(this: mongoose.Document) {
  for (let path of APPLICATION_FILE_PATHS) {
    // Handle base64 resumes => s3
    // If upload fails for whatever reason, just persist the base64
    const resume = get(this, path);
    if (resume && resume.indexOf('data:') === 0) {
      try {
        const result = await uploadBase64Content(HACKATHON_YEAR_STRING + "/" + this._id + "-" + path, resume);
        if (result.Key) {
          set(this, path, result.Key);
        }
      } catch (e) {
        // fall through - fixme add error logging
        console.error(e);
      }
    }
    else if (resume) {
      // If resume was not freshly uploaded, just persist the old one
      // Get resume id from the URL
      const match = resume.match(/amazonaws.com\/(.*?)\?AWS/);
      if (match && match[1]) {
        set(this, path, match[1]);
      }
    }
  }
}

export async function injectDynamicApplicationContent(doc: IApplication) {
  for (let path of APPLICATION_FILE_PATHS) {
    const resume = get(doc, path);
    if (resume && resume.indexOf('data:') !== 0) {
      try {
        const url = await generateSignedUrlForFile(resume);
        set(doc, path, url);
      } catch (e) {
        // fall through - fixme add error logging
        console.error(e);
      }
    }
  }
  return doc;
}

/*
 * Only filter by allowed applications and fields.
 * 
 * For example, only admins can view all fields.
 * Sponsors can only view certain fields, and can only view admitted people who have not opted out.
 * 
 * This is run on the find hook (aggregate view for admins and sponsors)
 * and findOne hook (admin table view, and for a normal applicant viewing their application)
 */
export function projectAllowedApplicationFields(this: mongoose.Query<IApplication>) {
  let query = this.getQuery();
  const options = this.getOptions();
  let groups = get(options, "treehacks:groups", []);
  let getGenericList = get(options, "treehacks:getGenericList", false);
  let isApplicationModel = get(options, "treehacks:isApplicationModel", "");
  if (groups.indexOf("admin") > -1) {
  }
  else if (groups.indexOf("sponsor") > -1) {
    query = {
      "$and": [
        query,
        { "sponsor_optout": { "$ne": true } },
        { "status": STATUS.ADMISSION_CONFIRMED }
      ]
    };
    this.setQuery(query);
    // if (!this.selectedInclusively()) {
      (this as any)._fields = {}; // Todo: change this when mongoose has a way to clear selection.
      this.select([
        "user.id",
        "user.email",
        ...sponsorApplicationDisplayFields.map(e => "forms.application_info." + e)
      ].join(" "));
    // }
  }
  else {
    // Regular applicants can only view user id's and meet_info of ADMISSION_CONFIRMED participants
    // with existing meet_info fields and meet_info.showProfile equal to true.
    if (getGenericList && isApplicationModel) {
      query = {
        "$and": [
          query,
          { "status": STATUS.ADMISSION_CONFIRMED },
          { "forms.meet_info": { "$exists": true } },
          { "forms.meet_info.showProfile": true }
        ]
      };
      this.setQuery(query);
      // if (!this.selectedInclusively()) {
        (this as any)._fields = {}; // Todo: change this when mongoose has a way to clear selection.
        this.select([
          "user.id",
          "forms.meet_info",
          "forms.application_info.first_name",
          "forms.application_info.last_name"
        ].join(" "));
      // }
    }
  }
}