import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const initialUser = { isLoggedIn: false, name: '', email: '', role: '' };
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(initialUser);

  const login = async (email, password) => {
    // MODIFIED: Implemented login
    try {
      const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;

      const profileRes = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      const profile = await profileRes.json();

      const newUser = {
        isLoggedIn: true,
        name: profile.username,
        email: profile.email,
        role: profile.role
      };
      setUser(newUser);
      localStorage.setItem("session", JSON.stringify(newUser));
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include"
    });
    const newUser = { isLoggedIn: false, name: '', email: '', role: '' };
    setUser(newUser);
    localStorage.setItem("session", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}