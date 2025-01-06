import { IUser } from "../models/user";

export interface ILoginResponse {
    token: string;
    user: IUser;
}