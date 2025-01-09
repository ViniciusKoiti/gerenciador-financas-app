import { ApiResponse } from "@app/models/apiResponse";
import { AuthService } from "../services/auth.service";

export class HttpClient {
    constructor(
        private baseUrl: string,
        private authService: AuthService
    ) {}

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        if (this.authService.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${this.authService.getToken()}`;
        }

        return headers;
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: this.getHeaders()
            });
            
            const apiResponse: ApiResponse<T> = await response.json();
            
            if (!response.ok) {
                throw new Error(apiResponse.message);
            }
            
            return apiResponse;
        } catch (error) {
            throw error;
        }
    }
}