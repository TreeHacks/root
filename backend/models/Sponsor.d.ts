import { Document } from "mongoose";

export interface ISponsor extends Document {
  company_id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  prizes: {
    name: string;
    description: string;
    reward: string;
    type: string;
  };
  users: {
    hacker_emails: string[];
  };
  year: string;
  created_at: number;
  updated_at: number;
}
