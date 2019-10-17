/*
 * Fix users by getting their custom:location attributes in cognito and transferring them to mongodb.
 * This is a one-time script run due to the fact that the "location" attribute was not initially stored in mongodb.
 * Instructions: Add ADMIN_AWS_KEY, ADMIN_AWS_SECRET, MONGODB_CONN_STR_DEV, MONGODB_CONN_STR_PROD, COGNITO_USER_POOL_ID_DEV, COGNITO_USER_POOL_ID_PROD to your .env file. Set the "prod" boolean to true or false.
 * Usage: npx ts-node ./util/userMigrate.js
 */
const Application = require("../src/models/Application");
var aws = require('aws-sdk');
const mongoose = require('mongoose');
require('dotenv').config();
const _ = { find: require('lodash/find') };

aws.config.update({ accessKeyId: process.env.ADMIN_AWS_KEY, secretAccessKey: process.env.ADMIN_AWS_SECRET });
var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-1' });
var prod = false;
let connStr = prod ? process.env.MONGODB_CONN_STR_PROD : process.env.MONGODB_CONN_STR_DEV;
let userPoolId = prod ? process.env.COGNITO_USER_POOL_ID_PROD : process.env.COGNITO_USER_POOL_ID_DEV;

/*
 * Retrieve all users in the cognito user pool.
 */
function buildUserList(paginationToken, updateUser, done) {
    let args = { Limit: 60, AttributesToGet: null, UserPoolId: userPoolId };
    if (paginationToken) {
        args.PaginationToken = paginationToken;
    }
    client.listUsers(args, (err, data) => {
        if (err) {
            console.log('error ' + err);
            return;
        }
        data.Users.forEach(user => {
            let sub = _.find(user.Attributes, { Name: "sub" });
            let location = _.find(user.Attributes, { Name: "custom:location" });
            if (!sub || !location) {
                console.log("Sub or location is undefined, skipping user: " + (sub && sub.Value) + "|" + (location && location.Value))
            }
            else {
                updateUser(sub.Value, location.Value)
            }
        });
        if (data.PaginationToken) {
            buildUserList(data.PaginationToken, updateUser, done);
        }
        else {
            done();
        }
    });
}
mongoose.connect(connStr).then(res => {

    /*
     * Go through all cognito accounts on the user pool,
     * and set the "location" attribute in the corresponding application DB
     * to "custom:location" when "location" is not already defined.
     */
    function bulkUpdateLocations() {
        var bulk = res.models.Application.collection.initializeOrderedBulkOp();
        let paginationToken = null;
        let updateUser = (sub, location) => bulk.find({
            'user.id': sub, "location": {
                "$exists": false
            }
        }).update({ '$set': { 'location': location } });
        let done = () => bulk.execute(e => {
            console.log("Done " + e);
        });
        buildUserList(paginationToken, updateUser, done);
    }

    /*
     * Update all Stanford accounts with no location to default to "California".
     */
    function bulkUpdateStanfordLocations() {
        res.models.Application.collection.updateMany({
            "type": "stanford",
            "location": {
                "$exists": false
            }
        }, { "$set": { "location": "California" } });
    }

    bulkUpdateLocations();
    bulkUpdateStanfordLocations();
    
    mongoose.connection.close();

}).catch(function (reason) {
    console.log('Error: ', reason);
});