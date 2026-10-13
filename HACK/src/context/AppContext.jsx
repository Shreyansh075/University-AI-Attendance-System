import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    registeredUsers: []
  });

  const login = (user, role = user?.role) => {
    setState((prev) => ({
      ...prev,
      user: { ...(user || {}), role }
    }));
  };

  const logout = () => {
    setState((prev) => ({ ...prev, user: null }));
  };

  const registerUser = (user) => {
    setState((prev) => ({
      ...prev,
      registeredUsers: [...prev.registeredUsers, user]
    }));
  };

  const value = useMemo(
    () => ({ state, login, logout, registerUser }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
