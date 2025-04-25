import React, { useState } from "react";
import { Pagination as AntPagination, Select } from "antd";

interface PaginationProps {
  totalPages?: number;
  currentItemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages = 1,
  currentItemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  const handlePageSizeChange = (value: number) => {
    if (onItemsPerPageChange) onItemsPerPageChange(value);
  };

  return (
    <div className="flex items-center gap-4 justify-end mt-4">
      <span className="text-sm">Sahifalar</span>
      <AntPagination
        current={currentPage}
        total={totalPages * currentItemsPerPage}
        pageSize={currentItemsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
        simple
      />
      <Select
        value={currentItemsPerPage}
        onChange={handlePageSizeChange}
        style={{ width: 80 }}
        options={[
          { value: 10, label: '10' },
          { value: 20, label: '20' },
          { value: 30, label: '30' },
          { value: 50, label: '50' },
        ]}
      />
    </div>
  );
};

export default Pagination;
