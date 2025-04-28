import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Tag, Button } from "antd";
import AddDiscountModal from "./AddDiscountModal";

interface DiscountType {
  id: string;
  student_id: string;
  percent: number;
  description?: string;
  valid_from: string;
  valid_to: string;
}

const Discounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/discounts")
      .then(res => setDiscounts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const [showAdd, setShowAdd] = useState(false);

  const refresh = () => {
    setLoading(true);
    instance.get("/discounts")
      .then(res => setDiscounts(res.data))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Chegirmalar</Typography.Title>
        <Button type="primary" onClick={() => setShowAdd(true)}>Chegirma qo‘shish</Button>
      </div>
      <Spin spinning={loading}>
        <List
          dataSource={discounts}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<span>O‘quvchi ID: <Tag color="blue">{item.student_id}</Tag></span>}
                description={<>
                  <span>Chegirma: <b>{item.percent}%</b> {item.description && `- ${item.description}`}</span><br/>
                  <span>Amal qiladi: {new Date(item.valid_from).toLocaleDateString()} - {new Date(item.valid_to).toLocaleDateString()}</span>
                </>}
              />
            </List.Item>
          )}
        />
      </Spin>
      <AddDiscountModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={refresh} />
    </div>
  );
};

export default Discounts;
