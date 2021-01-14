import { Document } from "mongoose";

export interface IHackReview {
    reader: { id: string; email: string };
    creativity: number;
    technicalComplexity: number;
    socialImpact: number;
    comments: string;
}

export interface IHack extends Document {
    devpostUrl: string;
    title: string;
    categories: string[];
    table: string;
    reviews: IHackReview[];
    _id: number;
    disabled: boolean;
    numSkips: number;
    floor: number;
}
