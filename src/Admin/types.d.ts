import { IFormState } from "../store/form/types";
import { IAdminState } from "src/store/admin/types";

export interface IAdminProps {
    applicationList: any[]
}

export interface IAdminWrapperProps extends IAdminState {
    getApplicationList: () => void,
    changeApplicationStatus: (string) => void
}
