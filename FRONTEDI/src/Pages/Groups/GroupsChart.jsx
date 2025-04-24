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

const GroupsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await instance.get("/groups/statistics");
        setData(res.data.data || []);
      } catch (err) {
        setError("Guruhlar statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Kurslar bo‘yicha guruhlar soni (bar)
  const courseLabels = data.map(d => d.course || d.course_name || "-");
  const groupCounts = data.map(d => d.count || d.group_count || 0);

  // Aktiv/pasiv guruhlar (pie)
  const active = data.filter(d => d.status === "active").length;
  const passive = data.filter(d => d.status === "passive").length;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Guruhlar statistikasi</h2>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Kurslar bo‘yicha guruhlar soni (Bar Chart)</h4>
            <Bar
              data={{
                labels: courseLabels,
                datasets: [
                  {
                    label: "Guruhlar soni",
                    data: groupCounts,
                    backgroundColor: "#fbc02d"
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Guruhlar statusi (Pie Chart)</h4>
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

export default GroupsChart;
