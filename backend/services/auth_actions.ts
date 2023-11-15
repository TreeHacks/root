import AWS from "aws-sdk";
import passwordGenerator from "generate-password";
import Judge from "../models/Judge";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export async function bulkAutoCreateUser({ email, group, password = null }) {
  password = password || passwordGenerator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    strict: true
  });

  const params: AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
    Username: email,
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'email_verified',
        Value: 'true'
      },
      {
        Name: 'name',
        Value: 'TreeHacks User' // Required in IDP config (cannot be made optional after IDP creation)
      }
    ]
  };

  try {
    const { User } = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

    if (!User || !User.Username) {
      throw new Error('Unable to create user');
    }

    const groupParams: AWS.CognitoIdentityServiceProvider.Types.AdminAddUserToGroupRequest = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
      GroupName: group,
      Username: User.Username
    };
    await cognitoIdentityServiceProvider.adminAddUserToGroup(groupParams).promise();
    
    if (group === "judge") {
      await new Judge({_id: User.Username, email: email}).save();
    }

    return {
      id: User.Username,
      email,
      password
    };

  } catch (e) {
    console.error(e.message);
    return {
      id: 'ERROR',
      email,
      error: e.message
    };
  }
} 

export async function bulkAutoCreateUsers({ emails, group, password }) {
  const requests = emails.map(email => bulkAutoCreateUser({ email, group, password }));
  const results = await Promise.all(requests);
  return results;
}
