import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import { SponsorAdmin } from "../../models/SponsorAdmin";
import Application from "../../models/Application";

export async function getSponsors(_: Request, res: Response) {
  const sponsors = await Sponsor.find({});

  res.status(200).json({ data: sponsors, count: sponsors.length });
}

export async function getSponsorDetail(req: Request, res: Response) {
  const { sponsorId: _id } = req.params;
  const sponsor = await Sponsor.findOne({ _id });

  res.status(200).json({ data: sponsor });
}

export async function getSponsorByAdminEmail(req: Request, res: Response) {
  const { email } = req.query;

  const admin = await SponsorAdmin.findOne({ email });
  if (!admin) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const { company_id } = admin;
  const sponsor = await Sponsor.findOne({ company_id }, { "users.hacker_emails": 0 });

  res.status(200).json({ data: sponsor });
}

export async function getHackersByAdminEmail(req: Request, res: Response) {
  const { email } = req.query;

  const admin = await SponsorAdmin.findOne({ email });
  if (!admin) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const { company_id } = admin;
  const sponsor = await Sponsor.findOne({ company_id }, { "users.hacker_emails": 1 });
  if (!sponsor) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const { hacker_emails } = sponsor.users;
  const hackers = await Application.find({ "user.email": { $in: hacker_emails } });

  res.status(200).json({ data: hackers });
}
