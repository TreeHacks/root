import Application from "../models/Application";
import { STATUS } from "../constants";

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
            {
                $or: [
                    {
                        num_reads: {
                            $lt: 3
                        }
                    },
                    {
                        num_reads: {
                            $exists: false
                        }
                    }
                ]
            }
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
    Application.collection.updateOne({
        _id: (req.body.application_id)
    }, {
            $inc: {
                num_reads: 1
            },
            $push: {
                ratings: {
                    reader_id: res.locals.user.sub,
                    culture_fit: req.body.culture_fit,
                    experience: req.body.experience,
                    passion: req.body.passion,
                    is_organizer: req.body.is_organizer,
                    is_beginner: req.body.is_beginner
                }
            }
        }, function (err, records) {
            if (records.result.n == 1) {
                Application.collection.update({
                    _id: (res.locals.user.sub)
                }, {
                        $inc: {
                            num_applications_read: 1
                        },
                        $push: {
                            applications_read: req.body.application_id
                        }
                    }, function (err, records) {
                        if (records.result.n == 1) {
                            res.json({
                                "results": {
                                    "status": "success"
                                }
                            });
                        } else {
                            res.json({
                                "results": {
                                    "status": "failure"
                                }
                            });
                        }
                    });
            } else {
                res.json({
                    "results": {
                        "status": "failure"
                    }
                });
            }
        });
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
                                $nin: data.applications_read || []
                            }
                        },
                        { status: STATUS.SUBMITTED },
                        {
                            $or: [
                                {
                                    num_reads: {
                                        $lt: 3
                                    }
                                },
                                {
                                    num_reads: {
                                        $exists: false
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            { $sample: { size: 1 } } // Pick random
        ]).toArray().then(data => {
            res.json(data);
        })
    })
};