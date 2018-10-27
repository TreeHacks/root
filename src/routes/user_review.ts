import Application from "../models/Application";
import { STATUS } from "../constants";
import { IApplication } from "../models/Application.d";

/*

Application.collection.insertMany(Array.apply(null, {length: 50}).map(e => (
    {"forms":{"application_info":{"first_name":Math.random() + "","last_name":Math.random() + "","phone":"1231232133","dob":"1900-01-01","gender":"M","race":["American Indian / Alaska Native"],"university":"Stanford University","graduation_year":"2018","level_of_study":"Undergraduate","major":"CS","accept_terms":true,"accept_share":true,"q1_goodfit":"asd","q2_experience":"sad","q3":"asdf","q4":"asdf"},"additional_info":{}},"user":{"email":"aramaswamis@gmail.com"},"status":"submitted","_id": Math.random() + "abc", "admin_info":{"reimbursement_amount":null},"reviews":[],"type":"oos"}
)));
*/

export const getLeaderboard = (req, res) => {
    Application.collection.aggregate([
        { $match: { reviews: { "$exists": 1 } } },
        { $unwind: "$reviews" },
        { $group: { _id: "$reviews.reader.email", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]).toArray().then(data => {
        res.json(data);
    });
};

export const getReviewStats = (req, res) => {
    Application.collection.find({
        $and: [
            { status: STATUS.SUBMITTED },
            { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
        ]
    }).count().then(num => {
        res.json({
            "results": {
                "num_remaining": num
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
    Application.collection.findOne({
        _id: (res.locals.user.sub)
    }).then(data => {
        Application.collection.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: {
                                $nin: (data && data.applications_read) || []
                            }
                        },
                        { status: STATUS.SUBMITTED },
                        { 'reviews.2': { $exists: false } } // Look for when length of "reviews" is less than 3.
                    ]
                }
            },
            { $sample: { size: 1 } }, // Pick random
            { $project: { "forms.application_info": 1, "user.email": 1, "type": 1 } }
        ]).toArray().then((data) => {
            res.json(data[0]);
        })
    })
};