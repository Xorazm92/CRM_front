import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { groupsService } from "../../../services/groups";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

interface GroupData {
  id: number;
  name: string;
  teacher: string;
  students: number;
  course: string;
}

const Group: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsService.getGroups
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable data={groups} type="groups" loading={isLoading} />
      </div>

      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Group;