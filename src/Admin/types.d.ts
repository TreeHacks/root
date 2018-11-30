import { IFormState } from "../store/form/types";
import { IAdminState } from "src/store/admin/types";
import { getApplicationList, getExportedApplications } from "src/store/admin/actions";
import { IBaseState } from "src/store/base/types";

export interface IReactTableState {
    page: number,
    pageSize: number,
    sorted: { id: string, desc: string }[],
    filtered: { id: string, value: boolean }[]
}

export interface IAdminTableProps extends IAdminState {
    getApplicationList: (state: IReactTableState) => void
    changeApplicationStatus: (string) => void,
    getApplicationEmails: (state: IReactTableState) => void,
    getExportedApplications: (state: IReactTableState) => void,
    setSelectedForm: (e: { id: string, name: string }) => void,
    base: IBaseState
}

export interface IStatsWrapperProps extends IAdminState {
    getApplicationStats: () => void,
}

export interface IStatsProps {
    applicationStats: { [x: string]: any };
}

export interface IBulkChangeProps extends IAdminState {
    performBulkChange: () => void,
    setBulkChangeStatus: (x: string) => void,
    setBulkChangeIds: (x: string) => void,
    userId: string
}