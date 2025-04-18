import React, { useState } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import "./Student.css";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";

const StudentPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const students = [
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
      id: 1,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      contact: "+998912131231",
      count: "3",
      school_length: "330 kun",
      payment_status: "to'langan",
      jobs: "Usta",
    },
  ];
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
    <div className="studentss-wrapper">
      <div className="header-student-page">
        <h1>O’quvchilar jadvali</h1>
        <Button onFilterClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <DataTable data={students} type="students" />
      {/* <DataTable data={teachers} type="teachers" />
      <DataTable data={parents} type="parents" />
      <DataTable data={groupsData} type="groups" />
      <DataTable data={reportsData} type="reports" /> */}
    </div>
  );
};

export default StudentPage;
