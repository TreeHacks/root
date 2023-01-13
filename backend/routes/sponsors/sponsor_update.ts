import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import { ISponsor } from "../../models/Sponsor.d";
import { SponsorAdmin } from "../../models/SponsorAdmin";

type SponsorType = Partial<Omit<ISponsor, "users">>;

export async function updateSponsor(req: Request, res: Response) {
  const { updated_by, ...attributes } = req.body;
  const sponsorAttributes: SponsorType = attributes;

  const admin = await SponsorAdmin.findOne({ email: updated_by });
  console.log("email", updated_by, admin, req.body);
  if (!admin) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { company_id } = admin;

  const sponsor = await Sponsor.updateOne(
    { company_id },
    { $set: sponsorAttributes },
    { upsert: true }
  );

  res.status(200).json({ data: sponsor });
}
