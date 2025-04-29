import React from "react";
import styles from "./SideStats.module.css";

interface SideStatsProps {
  income: number;
  incomeDiff: number;
  unpaidInvoices: number;
  averagePaymentTime: number;
  expense: number;
  expenseDiff: number;
  students: number;
  studentsDiff: number;
}

const SideStats: React.FC<SideStatsProps> = ({
  income,
  incomeDiff,
  unpaidInvoices,
  averagePaymentTime,
  expense,
  expenseDiff,
  students,
  studentsDiff,
}) => {
  return (
    <div className={styles.sideStats}>
      <div className={styles.statItem}>
        <span>Kirim:</span> <b>{income} so'm</b> <span className={incomeDiff >= 0 ? styles.up : styles.down}>{incomeDiff >= 0 ? `+${incomeDiff}` : incomeDiff}%</span>
      </div>
      <div className={styles.statItem}>
        <span>Chiqim:</span> <b>{expense} so'm</b> <span className={expenseDiff >= 0 ? styles.up : styles.down}>{expenseDiff >= 0 ? `+${expenseDiff}` : expenseDiff}%</span>
      </div>
      <div className={styles.statItem}>
        <span>To'lanmagan hisoblar:</span> <b>{unpaidInvoices}</b>
      </div>
      <div className={styles.statItem}>
        <span>O'rtacha to'lov vaqti:</span> <b>{averagePaymentTime} kun</b>
      </div>
      <div className={styles.statItem}>
        <span>O'quvchilar soni:</span> <b>{students}</b> <span className={studentsDiff >= 0 ? styles.up : styles.down}>{studentsDiff >= 0 ? `+${studentsDiff}` : studentsDiff}%</span>
      </div>
    </div>
  );
};

export default SideStats;
