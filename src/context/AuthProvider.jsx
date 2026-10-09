import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const DEFAULT_USER = {
  name: "Ilim Shomorov",
  role: "Gaming Setup Planner",
  email: "ilim@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

function readSavedSession() {
  try {
    if (window.localStorage.getItem("isAuthenticated") !== "true") {
      return null;
    }

    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (
        parsedUser &&
        typeof parsedUser === "object" &&
        typeof parsedUser.name === "string"
      ) {
        return { ...DEFAULT_USER, ...parsedUser };
      }
    }
  } catch (error) {
    console.error("Failed to restore the user session.", error);
  }

  return DEFAULT_USER;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setUser(readSavedSession());
      setIsLoading(false);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const login = (userData = DEFAULT_USER) => {
    const authenticatedUser = { ...DEFAULT_USER, ...userData };
    setUser(authenticatedUser);
    setIsLoading(false);

    try {
      window.localStorage.setItem("user", JSON.stringify(authenticatedUser));
      window.localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Failed to save the user session.", error);
    }
  };

  const logout = () => {
    setUser(null);

    try {
      window.localStorage.removeItem("user");
      window.localStorage.setItem("isAuthenticated", "false");
    } catch (error) {
      console.error("Failed to clear the user session.", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
