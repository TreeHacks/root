import { Request, Response } from 'express';
import axios from "axios";

export async function leaderboard(req: Request, res: Response) {
    const url = "https://api.eventive.org/reports/passholder_tickets_tags";
    const data = {
        "api_key": process.env.EVENTIVE_API_KEY,
        "event_bucket": process.env.EVENTIVE_EVENT_BUCKET,
    }
    try {
        const response = await axios.post(url, data);
        return res.json({
            success: true,
            data: response.data
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
}