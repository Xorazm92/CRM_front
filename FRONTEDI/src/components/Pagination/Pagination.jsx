import React, { useState } from "react";
import "./Pagination.css";
import images from "../../images";

const Pagination = ({
  totalPages,
  currentItemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <span className="pagination-label">Sahifalar</span>

      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        <img width={20} src={images.left} alt="js" />
      </button>

      <span className="pagination-page">{currentPage}</span>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        <img width={20} src={images.right} alt="right" />
      </button>

      <div className="custom-selects-container">
        <select
          value={currentItemsPerPage}
          onChange={(e) => onItemsPerPageChange(e.target.value)}
          className="custom-selects"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
        <div className="custom-selects-arrow"></div>
      </div>
    </div>
  );
};

export default Pagination;
