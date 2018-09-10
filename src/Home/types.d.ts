import { IFormState } from "../store/form/types";

export interface IHomeProps extends IFormState {
  getUserProfile: () => void,
  setPage: (e: number) => void
}