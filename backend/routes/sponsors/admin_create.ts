import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { SponsorAdmin, ISponsorAdmin } from "../../models/SponsorAdmin";
import { bulkAutoCreateUser } from "../../services/auth_actions";

export async function createAdmin(req: Request, res: Response) {
  const { email, password, token } = req.body;

  const { company_id } = jwt.verify(token, process.env.JWT_SECRET);

  await bulkAutoCreateUser({ email, password, group: "sponsor" });
  const sponsorAdmin: ISponsorAdmin = new SponsorAdmin({
    email,
    company_id,
  });

  res.status(200).json({ data: sponsorAdmin });
}
