import { IFormState } from "../store/form/types";
import { IReviewState } from "src/store/review/types";

export interface IAdminProps {
    applicationList: any[]
}

export interface IAdminWrapperProps extends IReviewState {
    getApplicationList: () => void,
    changeApplicationStatus: (string) => void
}
