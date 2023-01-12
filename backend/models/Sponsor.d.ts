import { Document } from "mongoose";

export interface ISponsor extends Document {
    name: string;
    description: string;
    logo_url: string;
    website_url: string;
    prizes: string[];
    users: {
        admin_ids: number[];
        hacker_ids: number[];
    },
    year: string;
    created_at: number;
    updated_at: number;
}