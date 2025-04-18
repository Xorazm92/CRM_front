
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import DataTable from "../../../components/DataTable/DataTable";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import Pagination from "../../../components/Pagination/Pagination";
import { parentsService } from "../../../services/parents";

interface Parent {
  id: number;
  name: string;
  contact: string;
  childrenCount: number;
  schoolLength: string;
  paymentStatus: string;
  job: string;
}

const Parents: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents'],
    queryFn: parentsService.getAll
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ota-Onalar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable data={parents} type="parents" />
        )}
      </div>
      
      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Parents;
