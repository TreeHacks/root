import { IFormState } from "../store/form/types";
import { IAdminState } from "src/store/admin/types";

export interface IAdminProps {
    applicationList: any[],
    setSelectedForm?: (e: {id: string, name: string}) => void
}

export interface IAdminWrapperProps extends IAdminState {
    getApplicationList: () => void,
    changeApplicationStatus: (string) => void,
    setSelectedForm: (e: {id: string, name: string}) => void
}

export interface IStatsWrapperProps extends IAdminState {
    getApplicationStats: () => void,
}

export interface IStatsProps {
    applicationStats: {[x: string]: any};
}