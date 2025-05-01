
import React from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
  diff?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, diff }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {diff !== undefined && (
        <div className={`${styles.diff} ${diff >= 0 ? styles.positive : styles.negative}`}>
          {diff >= 0 ? '+' : ''}{diff}%
        </div>
      )}
    </div>
  );
};

