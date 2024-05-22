export interface IUser {
    email: string;
    _id: string;
    role?: string;
    registrationDate: Date;
    lastLoginDate:Date
}