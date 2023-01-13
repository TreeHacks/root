import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import Application from "../../models/Application";

export async function addHackerToSponsor(req: Request, res: Response) {
  const { email } = req.body;
  const { sponsorId: _id } = req.params;

  const hacker = await Application.findOne({ "user.email": email });
  if (!hacker) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const sponsor = await Sponsor.findOne({ _id });
  if (!sponsor) {
    res.status(400).json({ error: "Invalid sponsor" });
    return;
  }

  const { hacker_emails } = sponsor.users;
  if (hacker_emails.includes(hacker.user.email)) {
    res.status(400).json({ error: "Hacker already added" });
    return;
  }

  sponsor.users.hacker_emails.push(hacker.user.email);
  await sponsor.save();

  res.status(200).json({ data: sponsor });
}



export async function removeHackerFromSponsor(req: Request, res: Response) {
  const { email } = req.body;
  const { sponsorId: _id } = req.params;

  const hacker = await Application.findOne({ "user.email": email });
  if (!hacker) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const sponsor = await Sponsor.findOne({ _id });
  if (!sponsor) {
    res.status(400).json({ error: "Invalid sponsor" });
    return;
  }

  const { hacker_emails } = sponsor.users;

  sponsor.users.hacker_emails = hacker_emails.filter((hacker_email) => hacker_email !== hacker.user.email);
  await sponsor.save();

  res.status(200).json({ data: sponsor });
}
