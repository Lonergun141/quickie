// User type matching Djoser backend
export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Auth state type
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Djoser JWT response
export interface DjoserAuthResponse {
    access: string;
    refresh: string;
}

// Djoser user info response  
export interface DjoserUserResponse {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
}

// API Response types
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface TokenRefreshResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
    };
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

// Login credentials
export interface LoginCredentials {
    email: string;
    password: string;
}

// Register credentials matching Djoser
export interface RegisterCredentials {
    email: string;
    password: string;
    re_password: string;
    firstname: string;
    lastname: string;
}

// Password reset types
export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}

// Account activation type
export interface ActivateAccountRequest {
    uid: string;
    token: string;
}
