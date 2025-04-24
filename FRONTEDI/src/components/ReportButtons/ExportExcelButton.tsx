import React from "react";

const ExportExcelButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
    onClick={onClick}
    type="button"
  >
    Excelga eksport
  </button>
);

export default ExportExcelButton;
