import { createContext, useEffect, useState } from "react";
import { getActiveTab } from "../utils/helpers";

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [visibleSearch, setVisibleSearch] = useState(false);

  useEffect(() => {
    if (visibleSearch) {
      document
        .getElementById("app")
        .addEventListener("click", () => setVisibleSearch(false));
    }

    return () => {
      document
        .getElementById("app")
        .removeEventListener("click", () => setVisibleSearch(false));
    };
  }, [visibleSearch]);

  return (
    <GlobalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        visibleSearch,
        setVisibleSearch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
