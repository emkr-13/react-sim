import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (fullname: string) => Promise<void>;
  clearLoginError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserProfile();

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        // Invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // Invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  const clearLoginError = () => {
    setLoginError(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      const response = await apiService.login(email, password);

      if (response.data.success) {
        const { token, refreshToken } = response.data.data;

        // Save tokens to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        // Load user profile
        await loadUserProfile();

        // Redirect to dashboard
        navigate("/");
      } else {
        setLoginError(response.data.message || "Login failed");
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.code === "ERR_NETWORK") {
        setLoginError(
          "Cannot connect to server. Please check your internet connection or try again later."
        );
      } else if (error.response?.status === 401) {
        setLoginError("Invalid email or password");
      } else if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else if (error.message) {
        setLoginError(error.message);
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsLoading(false);
      navigate("/login");
    }
  };

  const updateUserProfile = async (fullname: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.updateUserProfile({ fullname });

      if (response.data.success) {
        // Reload user profile to get updated data
        await loadUserProfile();
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginError,
        login,
        logout,
        updateUserProfile,
        clearLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
