import React from "react";
import "./SearchInput.css";

const SearchInput: React.FC = () => {
  return (
    <div className="search-input-wrapper">
      <input type="text" placeholder="Qidiruv tizimi..." />
    </div>
  );
};

export default SearchInput;
