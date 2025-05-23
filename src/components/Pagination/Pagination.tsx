import React, { useState } from "react";
import "./Pagination.css";
import icons from "../../images/icons";

interface PaginationProps {
  totalPages: number;
  currentItemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentItemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(e.target.value));
  };

  return (
    <div className="pagination-container">
      <span className="pagination-label">Sahifalar</span>
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        <img width={20} src={icons.left} alt="left" />
      </button>
      <span className="pagination-page">{currentPage}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        <img width={20} src={icons.right} alt="right" />
      </button>
      <div className="custom-selects-container">
        <select
          value={currentItemsPerPage}
          onChange={handleItemsPerPageChange}
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
