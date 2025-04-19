import React from "react";

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 ${className}`}
    />
  );
};

export default SearchInput;
