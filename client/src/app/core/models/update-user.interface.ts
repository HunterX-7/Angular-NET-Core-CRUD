export interface UpdateUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: 'Admin' | 'User';
}