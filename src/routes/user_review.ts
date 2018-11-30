import Application from "../models/Application";
import { STATUS } from "../constants";
import { IApplication } from "../models/Application.d";
import { injectDynamicApplicationContent } from "./common";

/*

Application.collection.insertMany(Array.apply(null, {length: 50}).map(e => (
    {"forms":{"application_info":{"first_name":Math.random() + "","last_name":Math.random() + "","phone":"1231232133","dob":"1900-01-01","gender":"M","race":["American Indian / Alaska Native"],"university":"Stanford University","graduation_year":"2018","level_of_study":"Undergraduate","major":"CS","accept_terms":true,"accept_share":true,"q1_goodfit":"asd","q2_experience":"sad","q3":"asdf","q4":"asdf"}},"user":{"email":"aramaswamis@gmail.com"},"status":"submitted","_id": Math.random() + "abc", "admin_info":{"reimbursement_amount":null},"reviews":[],"type":"oos"}
)));
*/

export const getLeaderboard = (req, res) => {
    Application.aggregate([
        { $match: { reviews: { "$exists": 1 } } },
        { $unwind: "$reviews" },
        { $group: { _id: "$reviews.reader.email", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]).then(data => {
        res.json(data);
    });
};

export const getReviewStats = (req, res) => {
    Promise.all([Application.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { type: 'is' },
            { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
        ]
    }).count().exec(), Application.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { type: 'oos' },
            { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
        ]
    }).count().exec()])
        .then(([num_is, num_oos]) => {
            res.json({
                "results": {
                    "num_remaining": num_is + num_oos,
                    "num_remaining_is": num_is,
                    "num_remaining_oos": num_oos
                }
            });
        })
};

export const rateReview = (req, res) => {
    Application.findOne(
        { "_id": req.body.application_id }).then((application: IApplication | null) => {
            if (!application) {
                res.status(400).send("Application to rate not found");
            }
            else {
                application.reviews.push({
                    reader: {
                        id: res.locals.user.sub,
                        email: res.locals.user.email
                    },
                    cultureFit: req.body.cultureFit,
                    experience: req.body.experience,
                    passion: req.body.passion,
                    isOrganizer: req.body.isOrganizer,
                    isBeginner: req.body.isBeginner
                });
                return application.save();
            }
        }).then(() => {
            res.json({
                "results": {
                    "status": "success"
                }
            });
        })
};

export const reviewNextApplication = (req, res) => {
    const applicationReviewDisplayFields = ["first_name", "last_name", "university", "graduation_year", "level_of_study", "major", "skill_level", "hackathon_experience", "resume", "q1_goodfit", "q2_experience", "q3", "q4"];
    let projectedFields = { "_id": 1 };
    for (let field of applicationReviewDisplayFields) {
        projectedFields[`forms.application_info.${field}`] = 1;
    }
    let createAggregationPipeline = (getOos) => ([
        {
            $match: {
                $and: [
                    { 'reviews.reader.id': { $ne: res.locals.user.sub } }, // Not already reviewed by current user
                    { status: STATUS.SUBMITTED },
                    { type: getOos ? "oos" : { $ne: "oos" } },
                    { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
                ]
            }
        },
        { $sample: { size: 1 } }, // Pick random
        { $project: projectedFields }
    ]);
    Application.findOne({
        _id: (res.locals.user.sub)
    }).then(data => {
        Application.aggregate(createAggregationPipeline(true)).then(async data => {
            if (!data || data.length === 0) {
                return await Application.aggregate(createAggregationPipeline(false));
            }
            else {
                return await data;
            }
        }).then(async data => {
            let application = data[0];
            application = await injectDynamicApplicationContent(application);
            res.json(application);
        });
    })
};