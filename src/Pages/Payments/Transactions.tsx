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
    instance.get("/transactions")
      .then(res => setTransactions(res.data || []))
      .finally(() => setLoading(false));
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
