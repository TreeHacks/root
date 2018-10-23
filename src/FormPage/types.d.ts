import { IFormState } from "../store/form/types";

export interface IFormPageProps extends IFormState {
    setPage: (e: number) => void,
    setData: (e: any) => void,
    saveData: () => Promise<any>,
    loadData: () => void,
    goHome: () => void,
    getUserProfile: () => void
}