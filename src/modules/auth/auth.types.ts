import { z } from "zod";

/**
 * Authentication Type Definitions
 * Following system design document specifications
 */

// User interface (matches API contract)
export interface User {
  id: number; // IMPORTANT: number type as per system design
  name: string;
  email: string;
  avatar?: string;
  position: string;
  permissions: string[];
}

// Login API response
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_info: User;
}

// Login form validation schema
export const LoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// API response validation (runtime safety - Fail Fast mechanism)
export const AuthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_info: z.object({
    id: z.number(), // IMPORTANT: number type, not string
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().optional(),
    position: z.string(),
    permissions: z.array(z.string()),
  }),
});

// Refresh token response
export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

// Repository interface
export interface IAuthRepository {
  login(username: string, password: string): Promise<LoginResponse>;
  refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }>;
}
