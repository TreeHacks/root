import { Request, Response } from "express";

import { Sponsor } from "../../models/Sponsor";
import Application from "../../models/Application";

export async function addHackerToSponsor(req: Request, res: Response) {
  const { email } = {email: "ghussein@stanford.edu"};
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

  const { hacker_ids } = sponsor.users;
  if (hacker_ids.includes(hacker._id)) {
    res.status(400).json({ error: "Hacker already added" });
    return;
  }

  sponsor.users.hacker_ids.push(hacker._id);
  await sponsor.save();

  res.status(200).json({ data: sponsor });
}
