import { Document } from "mongoose";

export interface ISponsor extends Document {
    company_id: string;
    name: string;
    description: string;
    logo_url: string;
    website_url: string;
    prizes: string[];
    users: {
        hacker_ids: number[];
    },
    year: string;
    created_at: number;
    updated_at: number;
}