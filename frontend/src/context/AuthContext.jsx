import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;

  });

  const login = (userData, accessToken, refreshToken) => {

    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem("access", accessToken);

    localStorage.setItem("refresh", refreshToken);

    setUser(userData);

  };

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}
