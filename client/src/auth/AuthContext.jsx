import { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "../api/auth.api";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(jwtDecode(token));
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const login = async (data) => {
    const res = await loginApi(data);

    // ✅ IMPORTANT: only token exists
    const token = res.data.sessionToken;

    if (!token) {
      throw new Error("No token returned");
    }

    localStorage.setItem("token", token);

    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
