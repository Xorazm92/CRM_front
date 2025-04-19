import React, { useState } from "react";
import "./Report.css";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import ReportButtons from "../../components/ReportButtons/ReportButtons";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import DataTable from "../../components/DataTable/DataTable";
import Pagination from "../../components/Pagination/Pagination";

function Report() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const reportsData = [
    {
      id: 1,
      name: "Nodirova Shodiya Tursinjon qizi",
      date: "15.05.2021",
      summa: "400 000",
    },
    {
      id: 2,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      date: "15.05.2021",
      summa: "500 000",
    },
  ];

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="report-wrapper">
      <div className="header-student-page">
        <h1>Hisobotlar jadvali</h1>
        <ReportButtons />
        <Button showAdd={false} onFilterClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <DataTable data={reportsData} type="reports" />
      <footer className="footer">
        <div className="income_status">
          <p>Daromad umumiy summasi:</p>
          <span>1 000 000 so'm</span>
        </div>
        <Pagination />
      </footer>
    </div>
  );
}

export default Report;
