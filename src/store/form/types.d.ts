import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
  },
  schemas: {
    application: IAuthStateSchemaItem
  },
  page: number
}

export interface IApplicationItem {

}