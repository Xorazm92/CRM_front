import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Tag } from "antd";

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

  return (
    <div className="p-4 bg-white rounded shadow">
      <Typography.Title level={3}>Chegirmalar</Typography.Title>
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
    </div>
  );
};

export default Discounts;
