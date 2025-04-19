import React from "react";

interface DataFieldProps {
  label: string;
  value: string | number;
}

const DataField: React.FC<DataFieldProps> = ({ label, value }) => (
  <div className="mb-2">
    <span className="block text-gray-500 text-sm mb-1">{label}</span>
    <span className="block text-gray-900 font-medium">{value}</span>
  </div>
);

export default DataField;
