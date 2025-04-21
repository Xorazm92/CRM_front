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

const TeachersChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await instance.get("/teachers/statistics");
        setData(res.data.data || []);
      } catch (err) {
        setError("O‘qituvchilar statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fanlar bo‘yicha o‘qituvchilar soni
  const subjectLabels = data.map(d => d.subject || d.fan || "-");
  const subjectCounts = data.map(d => d.count || d.teacher_count || 0);

  // Jinslar bo‘yicha taqsimot (pie)
  const male = data.reduce((sum, d) => sum + (d.male || d.male_count || 0), 0);
  const female = data.reduce((sum, d) => sum + (d.female || d.female_count || 0), 0);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>O‘qituvchilar statistikasi</h2>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Fanlar bo‘yicha o‘qituvchilar soni (Bar Chart)</h4>
            <Bar
              data={{
                labels: subjectLabels,
                datasets: [
                  {
                    label: "O‘qituvchilar soni",
                    data: subjectCounts,
                    backgroundColor: "#009688"
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Jinslar bo‘yicha o‘qituvchilar taqsimoti (Pie)</h4>
            <Pie
              data={{
                labels: ["Erkak", "Ayol"],
                datasets: [
                  {
                    label: "Jins",
                    data: [male, female],
                    backgroundColor: ["#1976d2", "#f06292"]
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

export default TeachersChart;
