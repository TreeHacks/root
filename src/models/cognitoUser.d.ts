export interface CognitoUser {
    sub: string,
    email: string,
    "custom:location"?: string
}