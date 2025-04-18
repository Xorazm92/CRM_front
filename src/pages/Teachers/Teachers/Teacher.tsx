
import React, { useState } from "react";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

interface TeacherData {
  id: number;
  name: string;
  subject: string;
  phone: string;
  group: string;
}

const Teachers: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const teachersData: TeacherData[] = [
    {
      id: 1,
      name: "Aliyev Ali Valijonovich",
      subject: "Matematika",
      phone: "+998 90 123 45 67",
      group: "15-gurux",
    },
    {
      id: 2,
      name: "Valiyev Vali Alijonovich",
      subject: "Fizika",
      phone: "+998 90 123 45 67", 
      group: "16-gurux",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">O'qituvchilar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable data={teachersData} type="teachers" />
      </div>
      
      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Teachers;
