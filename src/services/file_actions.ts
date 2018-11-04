import AWS from "aws-sdk";

export async function uploadBase64Content(key, fileContent) {
    const contentType = fileContent.match(/data:([^;]+);/)[1];
    const content = fileContent.replace(/.*?base64,/, '');

    const params: any = {
        Bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_S3_REGION,
        Key: key,
        Body: new Buffer(content, 'base64'),
        ContentEncoding: 'base64',
        ContentType: contentType
    };

    const result: AWS.S3.Types.CompleteMultipartUploadOutput = await new Promise((resolve, reject) => {
        new AWS.S3().upload(params, (err, data) => {
            if (err) { return reject(err); }
            resolve(data);
        });
    });

    return result;
}

const SIGNED_EXPIRY_SECONDS = 60 * 5;

export async function generateSignedUrlForFile(filePath) {
    return new AWS.S3().getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filePath,
        Expires: SIGNED_EXPIRY_SECONDS
    });
}
