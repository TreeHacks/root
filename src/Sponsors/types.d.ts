import { IFormState } from "../store/form/types";
import { IAdminState } from "../store/admin/types";
import { getApplicationList, getExportedApplications } from "../store/admin/actions";
import { IBaseState } from "../store/base/types";
import { IReactTableState } from "../Admin/types";

export interface ISponsorsTableProps extends IAdminState {
    getApplicationList: (state: IReactTableState) => void
    getApplicationResumes: (state: IReactTableState) => void,
    getExportedApplicationsCSV: (state: IReactTableState) => void,
    setSelectedForm: (e: { id: string, name: string }) => void,
    base: IBaseState
}