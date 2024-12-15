export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'Admin' | 'User';
    createdAt: string;
    updatedAt?: string;
}