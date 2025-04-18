
import React, { useState } from "react";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import ReportButtons from "../../components/ReportButtons/ReportButtons";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import DataTable from "../../components/DataTable/DataTable";
import Pagination from "../../components/Pagination/Pagination";

interface ReportData {
  id: number;
  name: string;
  date: string;
  summa: string;
}

const Report: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const reportsData: ReportData[] = [
    {
      id: 1,
      name: "Nodirova Shodiya Tursinjon qizi",
      date: "15.05.2021",
      summa: "400 000",
    },
    {
      id: 2,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      date: "15.05.2021",
      summa: "500 000",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hisobotlar jadvali</h1>
        <div className="flex space-x-4">
          <ReportButtons />
          <Button showAdd={false} onFilterClick={() => setIsFilterOpen(prev => !prev)} />
        </div>
        {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable data={reportsData} type="reports" />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-700">
          <span className="font-semibold">Daromad umumiy summasi: </span>
          <span className="text-green-600">1 000 000 so'm</span>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default Report;
