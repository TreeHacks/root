import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
    status: string,
  },
  schemas: {
    application_info: IAuthStateSchemaItem,
    additional_info: IAuthStateSchemaItem
  },
  page: number,
  formData: any,
  formName: string,
  userEdited: boolean
}

export interface IApplicationItem {
  status: string,
}