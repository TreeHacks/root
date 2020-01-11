export interface IUserAttributes {
  email: string,
  email_verified: boolean,
  name: string,
  "cognito:groups": string[]
}

export interface IAuthState {
  loggedIn: boolean,
  user: IUserAttributes,
  userId: string,
  admin: boolean,
  reviewer: boolean,
  sponsor: boolean,
  judge: boolean,
  applicant: boolean
}