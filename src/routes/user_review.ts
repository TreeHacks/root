import Application from "../models/Application";
import { STATUS } from "../constants";
import { IApplication } from "../models/Application.d";

export const getLeaderboard = (req, res) => {
    Application.collection.find({ num_applications_read: { "$exists": 1 } }).sort({
        num_applications_read: -1
    }).map(e => ({ "num_reads": e.ratings.length, "email": e.user.email })).toArray().then(data => {
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
                    reader_id: res.locals.user.sub,
                    culture_fit: req.body.culture_fit,
                    experience: req.body.experience,
                    passion: req.body.passion,
                    is_organizer: req.body.is_organizer,
                    is_beginner: req.body.is_beginner
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