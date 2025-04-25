// Converted from GroupsChart.jsx to GroupsChart.tsx with TypeScript, Ant Design, and professional UX
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
import { Card, Spin, Typography } from "antd";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface GroupStat {
  course?: string;
  course_name?: string;
  count?: number;
  group_count?: number;
  status?: string;
}

const GroupsChart: React.FC = () => {
  const [data, setData] = useState<GroupStat[]>([]);
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
      <Typography.Title level={2} style={{ textAlign: "center" }}>Guruhlar statistikasi</Typography.Title>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <Card style={{ marginBottom: 40 }} bodyStyle={{ background: '#fff', borderRadius: 8, padding: 24 }}>
            <Typography.Title level={4}>Kurslar bo‘yicha guruhlar soni (Bar Chart)</Typography.Title>
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
          </Card>
          <Card style={{ marginBottom: 40 }} bodyStyle={{ background: '#fff', borderRadius: 8, padding: 24 }}>
            <Typography.Title level={4}>Guruhlar statusi (Pie Chart)</Typography.Title>
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
          </Card>
        </>
      )}
    </div>
  );
};

export default GroupsChart;
