import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import { ISponsor } from "../../models/Sponsor.d";
type SponsorType = Omit<ISponsor, "users.hacker_ids">;

export async function createSponsor(req: Request, res: Response) {
  const sponsorAttributes: SponsorType = req.body;
  const sponsor = await Sponsor.create(sponsorAttributes);

  res.status(200).json({ data: sponsor });
}
