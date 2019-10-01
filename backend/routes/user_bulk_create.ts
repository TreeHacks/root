import { Request, Response } from 'express';
import { bulkAutoCreateUsers } from '../services/auth_actions';

export async function bulkCreateUsers(req: Request, res: Response) {
  try {
    const users = await bulkAutoCreateUsers({
      emails: req.body.emails,
      group: req.body.group,
      password: req.body.password
    });
    res.json({ users });

  } catch (err) {
    res.status(500).json(err);
  }
}
