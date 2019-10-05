/*
 * Removes duplicate reviews from applications.
 * Used from the mongodb command-line, one-time fix because of previous incorrect checks on the backend.
 */

db.applications.find({ 'reviews.1': { $exists: true } }).forEach(item => {
    var distinct = db.applications.distinct('reviews', { _id: item._id });
    if (item.reviews.length > distinct.length) {
        print(item._id);
        db.applications.update({ _id: item._id }, { $set: { reviews: distinct } });
    }
})