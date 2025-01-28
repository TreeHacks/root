import { IFormState } from "../store/form/types";

export interface IIDProps extends IFormState {
  getUserProfile?: () => void;
  loadData?: () => void;
}
