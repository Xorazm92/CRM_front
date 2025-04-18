
import React, { useState } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import Pagination from "../../../components/Pagination/Pagination";

interface GroupData {
  id: number;
  name: string;
  startDate: string;
  level: string;
}

const Group: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const groupsData: GroupData[] = [
    {
      id: 1,
      name: "1-guruh",
      startDate: "15.05.2021",
      level: "1-level",
    },
    {
      id: 2,
      name: "1-guruh",
      startDate: "15.05.2021",
      level: "2-level",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} showSaveCancel={false} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable data={groupsData} type="groups" />
      </div>
      
      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Group;
