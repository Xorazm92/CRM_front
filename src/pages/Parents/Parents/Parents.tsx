import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parentsService } from "../../../services/parents";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

interface ParentData {
  id: number; // Changed to number to match edited code
  name: string; // Combined firstName and lastName
  phone: string;
  children: string[]; // Added children, adjust as needed based on backend
  job: string;
}

const Parents: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents'],
    queryFn: parentsService.getParents // Changed function name
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ota-onalar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable data={parents} type="parents" loading={isLoading} />
      </div>

      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Parents;