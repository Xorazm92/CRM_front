import React, { useState } from "react";
import "./Teacher.css";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import DataTable from "../../../components/DataTable/DataTable";

function Teacher() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const teachers = [
    {
      id: 1,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      birthDate: "15.05.2021",
      gender: "O'g'il bola",
      contact: "+998965865745",
      attendance: true,
    },
    {
      id: 2,
      name: "Nodirova Shodiya Tursinjon qizi",
      birthDate: "15.05.2021",
      gender: "Qiz bola",
      contact: "+998914747485",
      attendance: false,
    },
  ];

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };
  return (
    <div className="teachers_wrapper">
      <div className="header-student-page">
        <h1>O’qituvchilar jadvali</h1>
        <Button onFilterClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <DataTable data={teachers} type="teachers" />
    </div>
  );
}

export default Teacher;
