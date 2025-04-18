
import React, { useState } from "react";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

interface Parent {
  id: number;
  name: string;
  contact: string;
  count: string;
  school_length: string;
  payment_status: string;
  jobs: string;
}

const Parents: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const parents: Parent[] = [
    {
      id: 1,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      contact: "+998912131231",
      count: "2",
      school_length: "300 kun",
      payment_status: "to'langan",
      jobs: "Usta",
    },
    {
      id: 2,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      contact: "+998912131231",
      count: "3",
      school_length: "330 kun",
      payment_status: "to'langan",
      jobs: "Usta",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ota-Onalar jadvali</h1>
        <div className="flex space-x-4">
          <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} showSaveCancel={false} />
          {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable data={parents} type="parents" />
      </div>
      
      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default Parents;
