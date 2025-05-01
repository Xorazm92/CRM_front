// Converted from TeachersChart.jsx to TeachersChart.tsx with TypeScript support
import React from "react";

interface TeachersChartProps {
  data: Array<{ name: string; value: number }>;
}

const TeachersChart: React.FC<TeachersChartProps> = ({ data }) => (
  <div>
    <h3>O'qituvchilar statistikasi</h3>
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>{item.name}: {item.value}</li>
      ))}
    </ul>
  </div>
);

export default TeachersChart;
