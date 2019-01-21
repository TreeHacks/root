export interface IFederatedCredentials {
  expires_at: number,
  provider: string,
  token: string,
  user: {
    email: string, name: string
  }
}
export interface IUserAttributes {
  email: string,
  email_verified: boolean,
  name: string,
  "cognito:groups": string[]
}
export interface IAuthStateSchemaItem {
  schema: {[x:string]: any},
  uiSchema: {[x:string]: any}
}
export interface IAuthState {
  loggedIn: boolean,
  user: IUserAttributes,
  userId: string,
  schemas: {
    signIn: IAuthStateSchemaItem,
    signUp: IAuthStateSchemaItem,
    forgotPassword: IAuthStateSchemaItem,
    forgotPasswordSubmit: IAuthStateSchemaItem,
    changePassword: IAuthStateSchemaItem
  },
  error: string,
  message: string,
  admin: boolean,
  reviewer: boolean,
  sponsor: boolean,
  judge: boolean,
  applicant: boolean,
  authPage: "forgotPassword" | "forgotPasswordSubmit" | "signIn" | "signUp" | "changePassword",
  attemptedLoginEmail: string
}