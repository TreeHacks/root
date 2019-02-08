import { IFormState } from "../store/form/types";

export interface IRoomsProps extends IFormState {
};

export interface IRoomsState {
    now: number,
    rooms: { id: string, name: string, expiry: Date, error: string }[],
    currentRoom: any
}
