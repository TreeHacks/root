import Hack from "../../models/Hack";
import { STATUS, applicationReviewDisplayFields, VERTICALS_TO_CATEGORIES, hackReviewDisplayFields } from "../../constants";
import { IHack } from "../../models/Hack.d";
import { find } from "lodash";
import Judge from "../../models/Judge";


export const getJudgeLeaderboard = (req, res) => {
    Hack.aggregate([
        { $match: { reviews: { "$exists": 1 } } },
        { $unwind: "$reviews" },
        { $group: { _id: "$reviews.reader.email", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]).then(data => {
        res.json(data);
    });
};

export const getJudgeStats = async (req, res) => {
    let numRemaining = await Hack.find({
        $and: [
            { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
        ]
    }).count().exec();
    res.json({
        "results": {
            "num_remaining": numRemaining
        }
    });
};

export const rateHack = async (req, res) => {
    let hack = await Hack.findOne(
        { "_id": req.body.hack_id });
    if (!hack) {
        return res.status(404).send("Hack to rate not found");
    }
    else if (hack.reviews && find(hack.reviews, { "reader": { "id": res.locals.user.sub } })) {
        return res.status(403).send("Hack already has a review submitted by user " + res.locals.user.sub);
    }
    else {
        hack.reviews.push({
            reader: {
                id: res.locals.user.sub,
                email: res.locals.user.email
            },
            creativity: req.body.creativity,
            technicalComplexity: req.body.technicalComplexity,
            socialImpact: req.body.socialImpact,
            comments: req.body.comments
        });
        await hack.save();
        return res.json({
            "results": {
                "status": "success"
            }
        });
    }
};

export const reviewNextHack = async (req, res) => {
    let judge = await Judge.findOne({ _id: res.locals.user.sub }) || { verticals: [] };
    let projectedFields = {};
    for (let field of hackReviewDisplayFields) {
        projectedFields[field] = 1;
    }
    let createAggregationPipeline = (categories: string[] = []) => ([
        {
            $match: {
                $and: [
                    { 'reviews.reader.id': { $ne: res.locals.user.sub } }, // Not already reviewed by current user
                    categories && categories.length ? { 'categories': { $in: categories } } : {},
                    { 'reviews.2': { $exists: false } }, // Look for when length of "reviews" is less than 3.
                ]
            }
        },
        // Prefer to pick applications with less reviews first
        { $project: { ...projectedFields, _reviewSize: { $size: '$reviews' } } },
        { $sort: { _reviewSize: 1 } },
        { $limit: 5 },
        { $sample: { size: 1 } }, // Pick random
        { $project: projectedFields }
    ]);
    let data = await Hack.aggregate(createAggregationPipeline((judge.verticals as string[]).map(e => VERTICALS_TO_CATEGORIES[e])));
    if (data[0]) {
        return res.json(data[0]);
    }
    else {
        data = await Hack.aggregate(createAggregationPipeline());
        return res.json(data[0]);
    }

};
