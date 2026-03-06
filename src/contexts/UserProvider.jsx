import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const initialUser = { isLoggedIn: false, name: '', email: '', role: '' };
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) {
      setUser(JSON.parse(session));
      // Re-verify with server on refresh
      fetch(`${API_URL}/api/user/profile`, { credentials: "include" })
        .then(res => {
          if (!res.ok) {
            sessionStorage.removeItem("session");
            setUser(initialUser);
            return null;
          }
          return res.json();
        })
        .then(profile => {
          if (!profile) return;
          const refreshedUser = {
            isLoggedIn: true,
            name: profile.username,
            email: profile.email,
            role: profile.role
          };
          setUser(refreshedUser);
          sessionStorage.setItem("session", JSON.stringify(refreshedUser));
        })
        .catch(() => {
          sessionStorage.removeItem("session");
          setUser(initialUser);
        });
    }
  }, []);

  const login = async (email, password) => {
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
      sessionStorage.setItem("session", JSON.stringify(newUser));
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
    sessionStorage.removeItem("session");
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