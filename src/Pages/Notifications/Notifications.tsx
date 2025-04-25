import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Badge } from "antd";

interface NotificationType {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/notifications")
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <Typography.Title level={3}>Bildirishnomalar</Typography.Title>
      <Spin spinning={loading}>
        <List
          dataSource={notifications}
          renderItem={item => (
            <List.Item style={{ background: item.is_read ? "#f6f6f6" : "#fff" }}>
              <List.Item.Meta
                title={<Badge dot={!item.is_read}>{item.type}</Badge>}
                description={item.message}
              />
              <span>{new Date(item.created_at).toLocaleString()}</span>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

export default Notifications;
