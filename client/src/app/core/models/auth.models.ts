import { User } from './user.model';

export interface ErrorResponse {
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}