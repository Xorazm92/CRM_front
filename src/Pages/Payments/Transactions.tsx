import React, { useEffect, useState } from "react";
import { Table, Spin, Typography } from "antd";
import instance from "../../api/axios";

interface TransactionType {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  source_id?: string;
  target_id?: string;
  reason?: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Student va teacher payments ni birlashtirib ko'rsatamiz
    Promise.all([
      instance.get("payments/student-payments"),
      instance.get("payments/teacher")
    ]).then(([studentRes, teacherRes]) => {
      // Ma'lumotlarni umumiy formatga keltirib birlashtiramiz
      const studentTx = (studentRes.data || []).map((item: any) => ({
        id: item.id || item._id,
        amount: item.amount,
        type: "Student",
        status: item.status,
        createdAt: item.created_at || item.createdAt,
        source_id: item.student_id,
        reason: item.reason || item.description || ""
      }));
      const teacherTx = (teacherRes.data || []).map((item: any) => ({
        id: item.id || item._id,
        amount: item.amount,
        type: "Teacher",
        status: item.status,
        createdAt: item.created_at || item.createdAt,
        source_id: item.teacher_id,
        reason: item.reason || item.description || ""
      }));
      setTransactions([...studentTx, ...teacherTx]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Typography.Title level={3}>Transactionlar</Typography.Title>
      <Spin spinning={loading}>
        <Table
          dataSource={transactions}
          columns={[
            { title: "Sana", dataIndex: "createdAt", key: "createdAt", render: (v: string) => new Date(v).toLocaleDateString() },
            { title: "Summasi", dataIndex: "amount", key: "amount" },
            { title: "Turi", dataIndex: "type", key: "type" },
            { title: "Status", dataIndex: "status", key: "status" },
            { title: "Izoh", dataIndex: "reason", key: "reason" }
          ]}
          rowKey={r => r.id}
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default Transactions;
