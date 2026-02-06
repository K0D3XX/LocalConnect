import type { User } from "@shared/models/auth";

// Mock user for testing without authentication
const mockUser: User = {
  id: "test-user-123",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  createdAt: new Date(),
};

export function useAuth() {
  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    logout: () => {
      console.log("Logout disabled in test mode");
    },
    isLoggingOut: false,
  };
}