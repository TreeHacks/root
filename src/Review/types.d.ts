import { IFormState } from "../store/form/types";
import { IReviewState } from "src/store/review/types";

export interface IReviewProps {
    applicationList: any[]
}

export interface IReviewWrapperProps extends IReviewState {
    getApplicationList: () => void,
    changeApplicationStatus: (string) => void
}
