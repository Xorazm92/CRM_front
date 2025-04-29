import React from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  diff?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, diff, color }) => {
  return (
    <div className={styles.card} style={color ? { borderColor: color } : {}}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {typeof diff === "number" && (
        <div className={styles.diff} style={{ color: diff >= 0 ? "green" : "red" }}>
          {diff >= 0 ? "+" : ""}{diff}%
        </div>
      )}
    </div>
  );
};

export default StatCard;
