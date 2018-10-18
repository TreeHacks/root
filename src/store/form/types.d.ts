import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
  },
  schemas: {
    application: IAuthStateSchemaItem
  },
  page: number,
  formData: any,
  formName: string
}

export interface IApplicationItem {

}