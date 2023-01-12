import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import { ISponsor } from "../../models/Sponsor.d";

type SponsorType = Partial<Omit<ISponsor, "users.hacker_ids">>;

export async function updateSponsor(req: Request, res: Response) {
  const { sponsorId: _id } = req.query.params;

  const sponsor = await Sponsor.findOne({ _id });
  if (!sponsor) {
    res.status(404).send("Resource not found");
    return;
  }

  const sponsorAttributes: SponsorType = req.body;

  Object.assign(sponsor, sponsorAttributes);
  await sponsor.save();

  res.status(200).json({ data: sponsor });
}
