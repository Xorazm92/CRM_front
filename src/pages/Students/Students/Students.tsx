import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "../../../services/students";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

interface StudentData {
  id: number;
  name: string;
  group: string;
  phone: string;
  parent: string;
}

const Students: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });
  const students = data?.data || [];

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">O'quvchilar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable data={students} type="students" />
      </div>

      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Students;