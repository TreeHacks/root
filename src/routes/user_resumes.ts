import Application from "../models/Application";
import { Request, Response } from 'express';
import async from "async";
import { getFile } from "../services/file_actions";
import { S3 } from "aws-sdk";
import JSZip from "jszip";
import fs from "fs";

export function getUserResumes(req: Request, res: Response) {
    // Todo: sponsor authentication; should not be able to get resumes of arbitrary ids.
    Application.find({"_id": {"$in": req.body.ids}}, {"forms.application_info.resume": 1, "forms.application_info.first_name": 1, "forms.application_info.last_name": 1}).lean()
    .then(results => {
        let requests: Promise<S3.Types.GetObjectOutput>[] = [];
        for (let result of results) {
            requests.push(getFile(result.forms.application_info.resume));
        }
        return Promise.all(requests).then(resumes => {
            const zip = JSZip();
            for (let i in resumes) {
                zip.file(`${results[i].forms.application_info.first_name} ${results[i].forms.application_info.last_name}.pdf`, resumes[i].Body);
            }
            zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
            .pipe(res)
            .on('finish', function () {
                res.end();
            });
        });

    })
    .catch(err => {
      return res.status(400).json(err);
    })
};