import AWS from "aws-sdk";
import fs from "fs";
import readFilePromise from "fs-readfile-promise";
import h2p from "html2plaintext";

AWS.config.update({ region: "us-east-1" });

export async function sendApplicationSubmittedEmail(toAddress) {
  const buffer = await readFilePromise("util/submitted_email.html");
  const htmlBody = buffer.toString();
  const textBody = h2p(htmlBody);

  var params = {
    Destination: {
      /* required */
      ToAddresses: [
        toAddress,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "🌲 Thanks for Applying to TreeHacks 2024 🌲",
      },
    },
    Source: "hello@treehacks.com" /* required */,
  };

  // Create the promise and SES service object
  return new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
}

export async function sendSponsorAccountCreationEmail(email: string, password: string) {
  const buffer = await readFilePromise("util/submitted_email.html");
  const htmlBody = buffer.toString();
  const textBody = h2p(htmlBody);

  var params = {
    Destination: {
      /* required */
      ToAddresses: [
        email,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <body>
              <p>Hi there,</p>
              <p>Thanks for signing up to sponsor TreeHacks 2023! We're excited to have you on board.</p>
              <p>As a sponsor, you'll have access to our platform to manage your sponsorship. You can find your login credentials below.</p>
              <p>Username: ${email}</p>
              <p>Temporary Password: ${password}</p>

              Please login to the sponsor portal at <a href="https://login.treehacks.com?redirect=https://meet.treehacks.com/admin">https://meet.treehacks.com</a> and change your password.
              You can then use the sponsor portal to create a sponsorship account that hackers can interact with!
              
              <p>Feel free to reach out to us at <a href="mailto:hello@treehacks.com"></a> if you have any questions.</p>
              
              <p>Thanks,</p>
              <p>The TreeHacks Team</p>
            </body>
          </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: "🌲 Sponsor Account Creation 🌲",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "🌲 Sponsor Account Creation 🌲",
      },
    },
    Source: "hello@treehacks.com" /* required */,
  };

  // Create the promise and SES service object
  return new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
}
