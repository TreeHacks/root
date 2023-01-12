import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";

export async function getSponsors(_: Request, res: Response) {
  const sponsors = await Sponsor.find({}, { name: 1 });

  res.status(200).json({ data: sponsors, count: sponsors.length });
}

export async function getSponsorDetail(req: Request, res: Response) {
  const { sponsorId: _id } = req.params;
  const sponsor = await Sponsor.findOne({ _id });

  res.status(200).json({ data: sponsor });
}
