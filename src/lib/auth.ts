import { config } from '../config/env';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface AuthResponse {
    success: boolean;
    user?: User;
    message?: string;
    error?: string;
    otp?: string;
}

class AuthService {
    private user: User | null = null;

    async signup(name: string, email: string, phone: string): Promise<AuthResponse> {
        const response = await fetch(`${config.apiUrl}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone }),
        });

        return await response.json();
    }

    async requestOtp(phone: string): Promise<AuthResponse> {
        const response = await fetch(`${config.apiUrl}/api/request-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });

        return await response.json();
    }

    async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
        const response = await fetch(`${config.apiUrl}/api/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp }),
        });

        const result = await response.json();

        if (result.success && result.user) {
            this.user = result.user;
        }

        return result;
    }

    getUser(): User | null {
        return this.user;
    }

    logout(): void {
        this.user = null;
    }

    isAuthenticated(): boolean {
        return this.user !== null;
    }
}

export const authService = new AuthService();