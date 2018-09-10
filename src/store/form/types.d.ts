import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
  },
  schemas: {
    application1: IAuthStateSchemaItem,
    application2: IAuthStateSchemaItem
  },
}

export interface IApplicationItem {

}