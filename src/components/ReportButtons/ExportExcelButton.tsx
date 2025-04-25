import React from "react";
import * as XLSX from "xlsx";

export interface ExportExcelButtonProps {
  data: any[];
  filename?: string;
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ data, filename = "hisobot.xlsx" }) => {
  const handleExport = () => {
    if (!Array.isArray(data) || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hisobot");
    XLSX.writeFile(workbook, filename);
  };
  return (
    <button className="export-excel-btn" onClick={handleExport} type="button">
      Excelga eksport
    </button>
  );
};

export default ExportExcelButton;
