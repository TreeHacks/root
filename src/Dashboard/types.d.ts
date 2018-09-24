import { IFormState } from "../store/form/types";

export interface IDashboardProps {
    profile: any
}

export interface IDashboardWrapperProps extends IFormState {
    getUserProfile: () => void
}
