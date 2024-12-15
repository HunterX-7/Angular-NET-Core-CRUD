export interface LoginResponse {
    token: string;
    userId: number;
    role: 'Admin' | 'User';
    email: string;
    firstName: string;
    lastName: string;
}