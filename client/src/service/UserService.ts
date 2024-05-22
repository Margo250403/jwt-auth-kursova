import $api from "../http";
import {AxiosResponse} from 'axios';
import {IUser} from "../models/IUser";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }

    static updateUser(id: string, email: string): Promise<AxiosResponse<any>> {
        return $api.patch<any>(`/user/${id}`, {email})
    }

    static deleteUser(id: string): Promise<AxiosResponse<any>> {
        return $api.delete<any>(`/user/${id}`)
    }
}