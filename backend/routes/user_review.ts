import Application from "../models/Application";
import { STATUS, IGNORED_REVIEWERS, applicationReviewDisplayFields, REVIEWS_PER_APP } from "../constants";
import { IApplication } from "../models/Application.d";
import { find } from "lodash";
import { injectDynamicApplicationContent } from "../utils/file_plugin";

// Uncomment to insert dummy data for testing.
// let TYPE = "oos";
// Application.collection.insertMany(Array.apply(null, Array(50)).map(e => (
//     {"yeat": 2019, "forms":{"application_info":{"first_name":Math.random() + "","last_name":Math.random() + "","phone":"1231232133","dob":"1900-01-01","gender":"M","race":["American Indian / Alaska Native"],"university":"Stanford University","graduation_year":"2018","level_of_study":"Undergraduate","major":"CS","accept_terms":true,"accept_share":true,"q1_goodfit":"asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd def def def dfef dfe fd sf ds fsd f sd fsd f dsfjskdlfjs dklf sld flsdj fkljsd fkl sjdlkfj sdklf jskdl fjlskd  asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd  ajskdlasj dklas jkdl ajskld ajskljdklasjdkla","q2_experience":"sad","q3":"asdf","q4":"asdf"}},"user":{"email":"aramaswamis@gmail.com"},"status":"submitted","_id": Math.random() + "abc", "admin_info":{"reimbursement_amount":null},"reviews":[],"type":TYPE}
// )));


export const getLeaderboard = (req, res) => {
    var d = new Date();
    d.setDate(d.getDate() - 7);

    Application.aggregate([
        { $match: { reviews: { "$exists": 1 } } },
        { $unwind: "$reviews" },
        { $match: { "reviews.reader.id": { $nin: IGNORED_REVIEWERS } } },
        { $group: { _id: "$reviews.reader.email", count: { $sum: 1 } } },
        // { $group: { _id: "$reviews.reader.email", count: { $sum: 1 }, dates: { $push: "$reviews.reviewedAt"} } },
        { $project: {
            _id: "$_id",
            count: "$count",
            // recentCount: { //last seven days
            //     $size: { $filter: { input: "$dates", as: "d", cond: { $gt: [ "$$d", d ] } } }
            // }
        }},
        { $sort: { count: -1 } }
    ]).then(data => {
        res.json(data);
    });
};

export const getReviewStats = (req, res) => {
    let key = `reviews.${REVIEWS_PER_APP - 1}`
    Promise.all([Application.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { type: 'is' },
            { [key]: { $exists: false } } // Look for when length of "reviews" is less than REVIEWS_PER_APP.
        ]
    }).count().exec(), Application.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { type: 'oos' },
            { [key]: { $exists: false } } // Look for when length of "reviews" is less than REVIEWS_PER_APP.
        ]
    }).count().exec(), Application.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { type: 'stanford' },
            { [key]: { $exists: false } } // Look for when length of "reviews" is less than REVIEWS_PER_APP.
        ]
    }).count().exec()])
        .then(([num_is, num_oos, num_stanford]) => {
            res.json({
                "results": {
                    "num_remaining": num_is + num_oos + num_stanford,
                    "num_remaining_is": num_is,
                    "num_remaining_oos": num_oos,
                    "num_remaining_stanford": num_stanford
                }
            });
        })
};

export const rateReview = async (req, res) => {
    let application = await Application.findOne(
        { "user.id": req.body.application_id });
    if (!application) {
        return res.status(404).send("Application to rate not found");
    }
    else if (application.reviews && application.reviews.length >= REVIEWS_PER_APP) {
        return res.status(403).send(`Application already has ${REVIEWS_PER_APP} reviews.`);
    }
    else if (application.reviews && find(application.reviews, { "reader": { "id": res.locals.user.sub } })) {
        return res.status(403).send("Application already has a review submitted by user " + res.locals.user.sub);
    }
    else {
        application.reviews.push({
            ...req.body,
            reader: {
                id: res.locals.user.sub,
                email: res.locals.user.email
            },
            reviewedAt: Date.now(),
        });
        await application.save();
        return res.json({
            "results": {
                "status": "success"
            }
        });
    }
};

export const reviewNextApplication = async (req, res) => {
    let projectedFields = { "_id": 1, "user": 1 };
    for (let field of applicationReviewDisplayFields) {
        projectedFields[`forms.application_info.${field}`] = 1;
    }
    let createAggregationPipeline = (type: string) => ([
        {
            $match: {
                $and: [
                    { 'reviews.reader.id': { $ne: res.locals.user.sub } }, // Not already reviewed by current user
                    { status: STATUS.SUBMITTED },
                    { type: type },
                    { [`reviews.${REVIEWS_PER_APP-1}`]: { $exists: false } } // Look for when length of "reviews" is less than REVIEWS_PER_APP.
                ]
            }
        },
        { $sample: { size: 1 } }, // Pick random
        { $project: projectedFields }
    ]);
    let data = await Application.aggregate(createAggregationPipeline("oos"));
    if (!data || (data.length === 0)) {
        data = await Application.aggregate(createAggregationPipeline("is"));
    }
    if (!data || (data.length === 0)) {
        data = await Application.aggregate(createAggregationPipeline("stanford"));
    }
    const application = await injectDynamicApplicationContent(data[0]);
    res.json(application);
};

// db.applications.find({'type': 'oos', 'status': 'submitted', 'reviews.0': { $exists: false }}).count()
