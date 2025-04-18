import React, { useState } from "react";
import "./Parents.css";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

function Parents() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const parents = [
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

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="p_wrapper">
      <div className="header-student-page">
        <h1>Ota-Onalar jadvali</h1>
        <Button onFilterClick={toggleFilter} showSaveCancel={false} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <DataTable data={parents} type="parents" />
      <footer className="footer">
        <Pagination />
      </footer>
    </div>
  );
}

export default Parents;
