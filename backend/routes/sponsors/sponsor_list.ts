import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import { SponsorAdmin } from "../../models/SponsorAdmin";

export async function getSponsors(_: Request, res: Response) {
  const sponsors = await Sponsor.find(
    {},
    { name: 1, description: 1, logo_url: 1, website_url: 1 }
  );

  res.status(200).json({ data: sponsors, count: sponsors.length });
}

export async function getSponsorDetail(req: Request, res: Response) {
  const { sponsorId: _id } = req.params;
  const sponsor = await Sponsor.findOne({ _id });

  res.status(200).json({ data: sponsor });
}

export async function getSponsorByAdminEmail(req: Request, res: Response) {
  const { email } = req.params;

  const admin = await SponsorAdmin.findOne({ email });
  if (!admin) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const { company_id } = admin;
  const sponsor = await Sponsor.findOne({ company_id });

  res.status(200).json({ data: sponsor });
}
