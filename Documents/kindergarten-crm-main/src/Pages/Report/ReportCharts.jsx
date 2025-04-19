import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ReportCharts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await instance.get("/dashboard/financial");
        setData(res.data.data || []);
      } catch (err) {
        setError("Grafiklar uchun ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Misol uchun: har oy bo‘yicha daromad statistikasi (dummy yoki backenddan kelgan)
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];

  // Agar backendda 'month' va 'income' bo‘lsa, shunga mos mapping
  const incomeByMonth = months.map((m, idx) => {
    const found = data.find(d => (d.month === idx + 1 || d.month === m));
    return found ? (parseInt(found.summa, 10) || 0) : 0;
  });

  // To‘lov statusi bo‘yicha taqsimot (pie chart uchun)
  const paid = data.filter(d => d.status === "paid").length;
  const pending = data.filter(d => d.status === "pending").length;
  const canceled = data.filter(d => d.status === "canceled").length;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Statistik Grafiklar</h2>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Oylik daromad (Bar Chart)</h4>
            <Bar
              data={{
                labels: months,
                datasets: [
                  {
                    label: "Oylik daromad (so'm)",
                    data: incomeByMonth,
                    backgroundColor: "#43a047"
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } }
              }}
            />
          </div>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>To‘lovlar statusi (Pie Chart)</h4>
            <Pie
              data={{
                labels: ["To‘langan", "Kutilmoqda", "Bekor qilingan"],
                datasets: [
                  {
                    label: "To‘lovlar soni",
                    data: [paid, pending, canceled],
                    backgroundColor: ["#43a047", "#fbc02d", "#e53935"]
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
            />
          </div>
          <div style={{ marginBottom: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #eee', padding: 24 }}>
            <h4>Oylik daromad (Line Chart)</h4>
            <Line
              data={{
                labels: months,
                datasets: [
                  {
                    label: "Oylik daromad (so'm)",
                    data: incomeByMonth,
                    fill: false,
                    borderColor: "#1976d2",
                    backgroundColor: "#1976d2"
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCharts;
