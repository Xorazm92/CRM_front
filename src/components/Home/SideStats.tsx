
import React from "react";
import styles from "./SideStats.module.css";

interface SideStatsProps {
  income: number;
  expense: number;
  students: number;
  studentsLabel: string;
  periodLabel: string;
  studentsDiff: number;
}

export const SideStats: React.FC<SideStatsProps> = ({
  income,
  expense,
  students,
  studentsLabel,
  periodLabel,
  studentsDiff
}) => {
  return (
    <div className={styles.sideStats}>
      <div className={styles.statHeader}>
        <span>{periodLabel}</span>
      </div>
      <div className={styles.statItem}>
        <span>Kirimlar</span>
        <b>{income.toLocaleString()} so'm</b>
      </div>
      <div className={styles.statItem}>
        <span>Chiqimlar</span>
        <b>{expense.toLocaleString()} so'm</b>
      </div>
      <div className={styles.statItem}>
        <span>{studentsLabel}</span>
        <b>{students.toLocaleString()} ta</b>
        <span className={studentsDiff >= 0 ? styles.up : styles.down}>
          {studentsDiff >= 0 ? '+' : ''}{studentsDiff}%
        </span>
      </div>
    </div>
  );
};