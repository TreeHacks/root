import { IFormState } from "../store/form/types";

export interface ITransportationProps extends IFormState {
    setPage: (e: number) => void,
    setData: (e: any, userEdited: boolean) => void,
    saveData: () => Promise<any>,
    submitForm: () => Promise<any>,
    loadData: () => void,
    goHome: () => void,
    getUserProfile: () => void,
    setFormName: (e: string) => void,
    setSubformName: (e: string) => void,
    incomingFormName: string,
    userEdited: boolean
}
