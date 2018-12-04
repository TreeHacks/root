import { uploadBase64Content, generateSignedUrlForFile } from '../services/file_actions';
import mongoose from 'mongoose';

export class S3File extends mongoose.SchemaType {
  cast (val) {
    return val;
  }
}

// @ts-ignore
mongoose.Schema.Types.S3File = S3File;

export default function s3FilePlugin (schema, options) {
  schema.pre('save', async function (this: mongoose.Document) {
    let doc = this;
    console.log(123);
    await Promise.all(Object.keys(schema.paths).map(async p => {
      console.log(schema.paths[p]);
    }));
  });
}
