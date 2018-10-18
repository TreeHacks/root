import { IFormState } from "../store/form/types";
import { IAuthState } from "src/store/auth/types";

export interface IHomeProps extends IFormState {
  getUserProfile: () => void
  auth: IAuthState
}