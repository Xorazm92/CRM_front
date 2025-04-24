import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CoursesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await instance.get("/courses/statistics");
        setData(res.data.data || []);
      } catch (err) {
        setError("Kurslar statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Kurslar nomlari va o‘quvchilar soni (bar)
  const courseLabels = data.map(d => d.name || d.course_name || "-");
  const studentCounts = data.map(d => d.student_count || d.count || 0);

  // Kurslar bo‘yicha status (pie)
  const active = data.filter(d => d.status === "active").length;
  const passive = data.filter(d => d.status === "passive").length;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Kurslar statistikasi</h2>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Kurslar bo‘yicha o‘quvchilar soni (Bar Chart)</h4>
            <Bar
              data={{
                labels: courseLabels,
                datasets: [
                  {
                    label: "O‘quvchilar soni",
                    data: studentCounts,
                    backgroundColor: "#1976d2"
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Kurslar statusi (Pie Chart)</h4>
            <Pie
              data={{
                labels: ["Aktiv", "Passiv"],
                datasets: [
                  {
                    label: "Status",
                    data: [active, passive],
                    backgroundColor: ["#43a047", "#bdbdbd"]
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesChart;
