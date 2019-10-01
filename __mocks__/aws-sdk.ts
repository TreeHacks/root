import { AWSError } from "aws-sdk";

const AWS: any = jest.genMockFromModule("aws-sdk");

AWS.CognitoIdentityServiceProvider.prototype.adminCreateUser = (params) => {
    return {
        "promise": async () => await { User: { Username: Math.random() + "" } }
    }
}

AWS.CognitoIdentityServiceProvider.prototype.adminAddUserToGroup = (params) => {
    return {
        "promise": async () => await true
    }
}

AWS.SES.prototype.sendEmail = (a) => {
    return {
        "promise": async () => await true
    };
}

AWS.S3.prototype.upload = (params, callback) => {
    callback("data");
}

AWS.S3.prototype.getObject = (params, callback) => {
    callback("data");
}

AWS.S3.prototype.getSignedUrl = async (operation, opts) => {
    return await "http://url";
}


// todo: mock s3 get object for user_resumes.ts

module.exports = AWS;