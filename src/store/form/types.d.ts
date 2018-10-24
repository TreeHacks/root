import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
    status: string,
  },
  schemas: {
    application: IAuthStateSchemaItem
  },
  page: number,
  formData: any,
  formName: string
}

export interface IApplicationItem {
  status: string,
}