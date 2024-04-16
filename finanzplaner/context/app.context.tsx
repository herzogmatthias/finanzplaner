// AuthContext.js
import React, { createContext, useState, useContext } from "react";

interface IAppContext {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <AppContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </AppContext.Provider>
  );
};
