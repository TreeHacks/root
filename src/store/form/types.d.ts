import { IAuthStateSchemaItem } from "../auth/types";

export interface IFormState {
  profile: {
    applications: IApplicationItem[]
    status: string,
    transportation_status: string,
    type: string,
    admin_info: {
      "acceptance"?: {
        "deadline": Date
      },
      "transportation"?: {
        "type": string,
        "amount"?: Number,
        "id"?: string,
        "deadline": String
      }
  },
    forms: any,
    user: {
      id: string
    }
  },
  schemas: {
    application_info: IAuthStateSchemaItem,
    transportation: IAuthStateSchemaItem
  },
  page: number,
  formData: any,
  formName: string,
  userEdited: boolean
}

export interface IApplicationItem {
  status: string,
}