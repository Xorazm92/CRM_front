import React from "react";
import { Doughnut } from "react-chartjs-2";
import styles from "./AgeChart.module.css";

interface AgeChartProps {
  labels: string[];
  data: number[];
}

const AgeChart: React.FC<AgeChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Yoshlar",
        data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className={styles.chartWrapper}>
      <Doughnut data={chartData} />
    </div>
  );
};

export default AgeChart;
