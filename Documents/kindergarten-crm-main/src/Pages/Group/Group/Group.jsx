import React, { useState } from "react";
import "./Group.css";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";

function Group() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const groupsData = [
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

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="p_wrapper">
      <div className="header-student-page">
        <h1>Guruhlar jadvali</h1>
        <Button onFilterClick={toggleFilter} showSaveCancel={false} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <DataTable data={groupsData} type="groups" />
      <footer className="footer">
        <Pagination />
      </footer>
    </div>
  );
}

export default Group;
