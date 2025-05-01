import React, { createContext, useState, ReactNode } from "react";

interface SearchContextProps {
  query: string;
  setQuery: (q: string) => void;
}

export const SearchContext = createContext<SearchContextProps>({
  query: "",
  setQuery: () => {},
});

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
