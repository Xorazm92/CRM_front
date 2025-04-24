import React from "react";
import ReportCharts from "../Report/ReportCharts";
import StudentsChart from "../Students/StudentsChart";
import TeachersChart from "../Teachers/TeachersChart";
import GroupsChart from "../Groups/GroupsChart";
import CoursesChart from "../Courses/CoursesChart";

const StatisticsDashboard = () => {
  return (
    <div style={{padding: '30px 0', background: '#f8fafc', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', marginBottom: 40}}>Umumiy Statistik Dashboard</h1>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40}}>
        <div style={{flex: '1 1 400px', minWidth: 350, maxWidth: 900}}>
          <ReportCharts />
        </div>
        <div style={{flex: '1 1 400px', minWidth: 350, maxWidth: 900}}>
          <StudentsChart />
        </div>
        <div style={{flex: '1 1 400px', minWidth: 350, maxWidth: 900}}>
          <TeachersChart />
        </div>
        <div style={{flex: '1 1 400px', minWidth: 350, maxWidth: 900}}>
          <GroupsChart />
        </div>
        <div style={{flex: '1 1 400px', minWidth: 350, maxWidth: 900}}>
          <CoursesChart />
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
