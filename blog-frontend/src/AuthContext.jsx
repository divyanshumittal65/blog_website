import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(normalized));
    return decoded;
  } catch {
    return {};
  }
}

function getStoredUser() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
    }
  }

  if (!token) return null;
  return decodeJwtPayload(token);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser);

  const login = (nextToken, nextUser = {}) => {
    const decodedUser = {
      ...decodeJwtPayload(nextToken),
      ...nextUser,
    };

    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(decodedUser));
    setToken(nextToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isLoggedIn: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
