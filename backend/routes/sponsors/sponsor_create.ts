import { Request, Response } from "express";
import AWS from "aws-sdk";

import { HACKATHON_YEAR } from "../../constants";
import { Sponsor } from "../../models/Sponsor";
import { ISponsor } from "../../models/Sponsor.d";
import { SponsorAdmin } from "../../models/SponsorAdmin";
type SponsorType = Omit<ISponsor, "users.hacker_ids">;

export async function createSponsor(req: Request, res: Response) {
  const sponsorAttributes: SponsorType = req.body;
  const sponsor = await Sponsor.create(sponsorAttributes);

  res.status(200).json({ data: sponsor });
}

export async function uploadSponsorLogo(req: Request & { file: any }, res: Response) {
  const uploaded_by = req.query.e;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const admin = await SponsorAdmin.findOne({ email: uploaded_by });
  if (!admin) {
    res.status(400).json({ error: "Invalid admin email" });
    return;
  }

  // todo handle global dep injection
  const s3 = new AWS.S3();

  const params = {
    Bucket: `treehacks-sponsor-content/${HACKATHON_YEAR}`,
    Key: `${admin.company_id}`,
    Body: file.buffer,
    ContentType: req.file.mimetype,
    ContentEncoding: "base64",
  };

  await new Promise((resolve, reject) => {
    s3.putObject(params, function(perr, pres) {
      if (perr) {
        reject(perr);
      } else {
        resolve(pres);
      }
    });
  });

  const sponsor = await Sponsor.findOne({ company_id: admin.company_id });
  if (!sponsor) {
    res.status(400).json({ error: "Invalid sponsor" });
    return;
  }

  sponsor.logo_url = `https://treehacks-sponsor-content.s3.amazonaws.com/${HACKATHON_YEAR}/${admin.company_id}`;
  await sponsor.save();

  res.status(200).json({ data: sponsor });
}
