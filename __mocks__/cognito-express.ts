const CognitoExpress: any = jest.genMockFromModule("cognito-express");

CognitoExpress.prototype.validate = (accessToken, callback) => {
    let response = {
        "at_hash": "hash123",
        "sub": "",
        "cognito:groups": [
        ],
        "email_verified": false,
        "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TEST",
        "cognito:username": "",
        "aud": "aud123",
        "identities": [
            {
                "userId": "test@stanford.edu",
                "providerName": "Stanford",
                "providerType": "SAML",
                "issuer": "https://idp.stanford.edu/",
                "primary": "true",
                "dateCreated": "123132"
            }
        ],
        "token_use": "id",
        "auth_time": 1546287902,
        "name": "Name",
        "exp": 1546291502,
        "iat": 1546287902,
        "email": ""
    };
    let email = "";
    let sub = "";
    let groups: string[] = [];

    switch (accessToken) {
        case "admin":
            email = "admin@treehacks";
            sub = "admintreehacks";
            groups = ["admin"];
            break;
        case "reviewer":
            email = "reviewer@treehacks";
            sub = "reviewertreehacks";
            groups = ["reviewer"];
            break;
        case "sponsor":
            email = "sponsor@treehacks";
            sub = "sponsortreehacks";
            groups = ["sponsor"];
            break;
        case "judge":
            email = "judge@treehacks";
            sub = "judgetreehacks";
            groups = ["judge"];
            break;
        case "applicant":
            email = "applicant@treehacks";
            sub = "applicanttreehacks";
            groups = [];
            break;
        case "error":
            callback("Cognito Mocked Error", null);
            break;
        default:
            throw "No case found";
    }
    response.email = email;
    response.sub = sub;
    response["cognito:username"] = sub;
    (response["cognito:groups"] as any) = groups;
    callback(null, response);
}

module.exports = CognitoExpress;