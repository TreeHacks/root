import { IFormState } from "../store/form/types";

export interface IFormPageWrapperProps extends IFormState {
    setPage: (e: number) => void,
    setData: (e: any) => void,
    saveData: () => Promise<any>,
    submitForm: () => Promise<any>,
    loadData: () => void,
    goHome: () => void,
    getUserProfile: () => void,
    setFormName: (e: string) => void,
    incomingFormName: string
}

export interface IFormPageProps {
  submitted: boolean,
  onChange: (any) => void,
  onError: (any) => void,
  onSubmit: (any) => void,
  schema: any,
  uiSchema: any,
  formData: any
}

export interface CustomDateWidgetProps {
  id?: string,
  registry?: object,
  time?: string,
  disabled?: boolean,
  autofocus?: boolean,
  readonly?: boolean,
  onBlur?: (e: string) => void,
  onChange?: (e: string) => void,
  options?: {
    yearsRange?: Array<number>
  }
}

export interface CustomDateWidgetState {
  year?: number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number
}
