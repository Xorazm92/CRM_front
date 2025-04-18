
import React, { useState } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";

interface Student {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  group: string;
  attendance: boolean;
}

const Students: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const students: Student[] = [
    {
      id: 1,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      birthDate: "15.05.2021",
      gender: "O'g'il bola",
      group: "15-gurux",
      attendance: true,
    },
    {
      id: 2,
      name: "Nodirova Shodiya Tursinjon qizi",
      birthDate: "15.05.2021",
      gender: "Qiz bola",
      group: "15-gurux",
      attendance: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">O'quvchilar jadvali</h1>
        <Button onFilterClick={() => setIsFilterOpen(prev => !prev)} />
        {isFilterOpen && <Filter closeFilter={() => setIsFilterOpen(false)} />}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable data={students} type="students" />
      </div>
    </div>
  );
};

export default Students;
