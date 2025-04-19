import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex gap-2 items-center justify-center my-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-3 py-1 rounded border ${current === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-blue-100`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
