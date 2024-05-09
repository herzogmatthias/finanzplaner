// AuthContext.js
import React, { createContext, useState, useContext } from "react";

interface IAppContext {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isNavOpen: boolean;
  toggleNav: () => void;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <AppContext.Provider
      value={{ isMenuOpen, toggleMenu, isNavOpen, toggleNav }}
    >
      {children}
    </AppContext.Provider>
  );
};
