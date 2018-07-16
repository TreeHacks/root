import { Request, Response } from 'express';
import Application from "../models/Application";

// Todo: not really a route, it's a helper function; move somewhere else.
export function createApplication(userId: string) {
  // Todo: Look up cognito user id.
  const application = new Application({
    "_id": userId,
    "forms": {
      "application_info": {"university": "stanford"},
      "additional_info": {"bus_confirmed_spot": true}
    },
    "admin_info": {},
    "reviews": [],
    "user": { "name": "default_user", "email": "default_email@default_email.com" },
    "type": "oos"
  });
  application.save();
}

