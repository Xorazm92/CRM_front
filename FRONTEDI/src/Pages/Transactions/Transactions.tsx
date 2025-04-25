import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Tag } from "antd";

interface TransactionType {
  id: string;
  amount: number;
  type: string;
  status: string;
  source_id?: string;
  target_id?: string;
  reason?: string;
  createdAt: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/transactions")
      .then(res => setTransactions(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <Typography.Title level={3}>Pul o‘tkazmalari</Typography.Title>
      <Spin spinning={loading}>
        <List
          dataSource={transactions}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<span>Miqdor: <b>{item.amount} so‘m</b> <Tag color="blue">{item.type}</Tag></span>}
                description={<>
                  <span>Status: <Tag color={item.status === 'SUCCESS' ? 'green' : item.status === 'FAILED' ? 'red' : 'orange'}>{item.status}</Tag></span><br/>
                  {item.reason && <span>Sabab: {item.reason}<br/></span>}
                  <span>Manba: {item.source_id || '-'} | Qabul qiluvchi: {item.target_id || '-'}</span><br/>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </>}
              />
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

export default Transactions;
