import React, { useState, useEffect } from "react";
import "./Report.css";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import ReportButtons from "../../components/ReportButtons/ReportButtons";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import DataTable from "../../components/DataTable/DataTable";
import Pagination from "../../components/Pagination/Pagination";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import ExportExcelButton from "../../components/ReportButtons/ExportExcelButton";
import "../../components/ReportButtons/ExportExcelButton.css";
import ReportCharts from "./ReportCharts";

interface Report {
  summa: string;
}

function Report() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/dashboard/financial");
      setReports(res.data.data || []);
    } catch (err) {
      setError(err.message || "Hisobotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Umumiy daromad hisoblash (misol uchun)
  const totalIncome = reports.reduce((sum, r) => sum + (parseInt(r.summa, 10) || 0), 0);

  return (
    <div className="report-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>Hisobotlar jadvali</h1>
        <ReportButtons />
        <ExportExcelButton data={reports} />
        <Button showAdd={false} onFilterClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <DataTable data={reports} type="reports" />
      )}
      <ReportCharts />
      <footer className="footer">
        <div className="income_status">
          <p>Daromad umumiy summasi:</p>
          <span>{totalIncome.toLocaleString()} so'm</span>
        </div>
        <Pagination />
      </footer>
    </div>
  );
}

export default Report;
