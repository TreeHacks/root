import { uploadBase64Content, generateSignedUrlForFile } from '../services/file_actions';
import mongoose from 'mongoose';
import { get, set } from "lodash";
import { IApplication } from '../models/Application.d';
import { STATUS, sponsorApplicationDisplayFields } from '../constants';

// Paths on the application that store file data that should be uploaded to S3.
const PATHS = ["forms.application_info.resume", "forms.transportation.receipt"];

export default function s3FilePlugin(schema: mongoose.Schema, options) {
  schema.pre('save', uploadDynamicApplicationContent);
  schema.pre('find', projectAllowedApplicationFields);
  // schema.post('findOne', injectDynamicApplicationContent);
}

async function uploadDynamicApplicationContent(this: mongoose.Document) {
  for (let path of PATHS) {
    // Handle base64 resumes => s3
    // If upload fails for whatever reason, just persist the base64
    const resume = get(this, path);
    if (resume && resume.indexOf('data:') === 0) {
      try {
        const result = await uploadBase64Content(this._id + "-" + path, resume);
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
    for (let path of PATHS) {
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
 * For example, only reviewers and admins can view all fields.
 * Sponsors can only view certain fields, and can only view admitted people who have not opted out.
 */
export function projectAllowedApplicationFields(this: mongoose.Query<IApplication>) {
  let query = this.getQuery();
  const options = (this as any).getOptions(); // Todo: fix mongoose types when https://github.com/DefinitelyTyped/DefinitelyTyped/pull/31798 is merged
  let groups = get(options, "treehacks:groups", []);
  if (groups.indexOf("admin") > -1 || groups.indexOf("reviewer") > -1) {
  }
  else { // Sponsors
    query = {"$and": [
      query,
      {"sponsor_optout": {"$ne": false}},
      {"status": STATUS.ADMISSION_CONFIRMED}
    ]};
    this.setQuery(query);
    if (!this.selected()) {
      this.select(["email", ...sponsorApplicationDisplayFields.map(e => "forms.application_info." + e)].join(" "));
    }
  }
}