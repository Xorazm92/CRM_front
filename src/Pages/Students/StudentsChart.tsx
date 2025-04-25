// Zamonaviy va professional StudentsChart.tsx (TypeScript + Ant Design + Chart.js)
import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
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

interface StudentStat {
  group_name?: string;
  groupName?: string;
  student_count?: number;
  count?: number;
  male?: number;
  male_count?: number;
  female?: number;
  female_count?: number;
}

const StudentsChart: React.FC = () => {
  const [data, setData] = useState<StudentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await instance.get("/students/statistics");
        setData(res.data.data || []);
      } catch (err) {
        setError("Talabalar statistikasi uchun ma'lumotlarni olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Guruhlar bo‘yicha o‘quvchilar soni
  const groupLabels = data.map(d => d.group_name || d.groupName || "-");
  const groupCounts = data.map(d => d.student_count || d.count || 0);

  // Jinslar bo‘yicha taqsimot (doughnut)
  const male = data.reduce((sum, d) => sum + (d.male || d.male_count || 0), 0);
  const female = data.reduce((sum, d) => sum + (d.female || d.female_count || 0), 0);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <Typography.Title level={2} style={{ textAlign: "center" }}>O‘quvchilar statistikasi</Typography.Title>
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{color:'#e53935',textAlign:'center'}}>{error}</div>
      ) : (
        <>
          <Card style={{ marginBottom: 40 }} bodyStyle={{ background: '#fff', borderRadius: 8, padding: 24 }}>
            <Typography.Title level={4}>Guruhlar bo‘yicha o‘quvchilar soni (Bar Chart)</Typography.Title>
            <Bar
              data={{
                labels: groupLabels,
                datasets: [
                  {
                    label: "O‘quvchilar soni",
                    data: groupCounts,
                    backgroundColor: "#1976d2"
                  }
                ]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </Card>
          <Card style={{ marginBottom: 40 }} bodyStyle={{ background: '#fff', borderRadius: 8, padding: 24 }}>
            <Typography.Title level={4}>Jinslar bo‘yicha o‘quvchilar taqsimoti (Doughnut)</Typography.Title>
            <Doughnut
              data={{
                labels: ["O‘g‘il bola", "Qiz bola"],
                datasets: [
                  {
                    label: "Jins",
                    data: [male, female],
                    backgroundColor: ["#43a047", "#f06292"]
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

export default StudentsChart;
