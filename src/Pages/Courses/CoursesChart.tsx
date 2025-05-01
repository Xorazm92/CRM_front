// Converted from CoursesChart.jsx to CoursesChart.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import instance from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CoursesChart: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/course/stats").then((res) => {
      const stats = res.data.data || [];
      setData({
        labels: stats.map((c: any) => c.name),
        datasets: [
          {
            label: "Talabalar soni",
            data: stats.map((c: any) => c.studentCount || 0),
            backgroundColor: "#1976d2",
          },
        ],
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Card title="Kurslar bo'yicha talabalar soni" style={{ marginTop: 24 }}>
      {loading ? <Spin /> : <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />}
    </Card>
  );
};

export default CoursesChart;
