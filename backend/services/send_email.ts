import AWS from "aws-sdk";
import fs from "fs";
import readFilePromise from 'fs-readfile-promise';
import h2p from "html2plaintext";

AWS.config.update({ region: 'us-east-1' });

export async function sendApplicationSubmittedEmail(toAddress) {
    
    const buffer = await readFilePromise('util/submitted_email.html');
    const htmlBody = buffer.toString();
    const textBody = h2p(htmlBody);

    var params = {
        Destination: { /* required */
            ToAddresses: [
                toAddress
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "🌲 Thanks for Applying to TreeHacks 2019 🌲"
            }
        },
        Source: 'hello@treehacks.com' /* required */
    };

    // Create the promise and SES service object
    return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
}
