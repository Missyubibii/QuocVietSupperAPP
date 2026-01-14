import type { IAuthRepository, LoginResponse } from "./auth.types";

/**
 * Mock Authentication Repository
 * Mock-First Strategy: Simulates API with delays and realistic behavior
 */

export class AuthMockRepository implements IAuthRepository {
  /**
   * Mock login with simulated network delay
   * SUCCESS: password = "123456"
   * FAILURE: any other password throws 401 error
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    // Simulate network delay (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (password !== "123456") {
      throw new Error("401:Invalid credentials");
    }

    // Return mock successful response
    return {
      access_token: "mock_access_token_" + Date.now(),
      refresh_token: "mock_refresh_token_" + Date.now(),
      expires_in: 3600, // 1 hour in seconds
      user_info: {
        id: 1001, // IMPORTANT: number type, not string
        name: username,
        email: `${username}@quocviet.com`,
        avatar: "https://i.pravatar.cc/150?img=1",
        position: "Mobile Developer",
        permissions: ["attendance.view", "task.create", "request.approve"],
      },
    };
  }

  /**
   * Mock token refresh with simulated delay
   * Always succeeds in mock mode
   */
  async refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Simulate shorter network delay (500ms for refresh)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      access_token: "refreshed_access_token_" + Date.now(),
      refresh_token: "refreshed_refresh_token_" + Date.now(),
    };
  }
}

// Export singleton instance
export const authMockRepo = new AuthMockRepository();
