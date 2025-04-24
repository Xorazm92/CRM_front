import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();
export { SearchContext };

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
