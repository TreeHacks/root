import AWS from "aws-sdk";
import passwordGenerator from "generate-password";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export async function bulkAutoCreateUser({ email, group }) {
  const password = passwordGenerator.generate({
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

    return {
      id: User.Username,
      email,
      password
    };

  } catch (e) {
    return {
      id: 'ERROR',
      email,
      error: e.message
    };
  }
} 

export async function bulkAutoCreateUsers({ emails, group }) {
  const requests = emails.map(email => bulkAutoCreateUser({ email, group }));
  const results = await Promise.all(requests);
  return results;
}
