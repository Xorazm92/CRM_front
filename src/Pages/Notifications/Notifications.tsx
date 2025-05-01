
import React, { useEffect, useState } from 'react';
import { List, Badge, Button, message } from 'antd';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../api/notifications';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      message.error('Bildirishnomalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (err) {
      message.error('Xatolik yuz berdi');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Bildirishnomalar</h2>
        <Button onClick={handleMarkAllAsRead}>Hammasini o'qilgan deb belgilash</Button>
      </div>
      
      <List
        loading={loading}
        dataSource={notifications}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button onClick={() => handleMarkAsRead(item.id)}>O'qilgan</Button>,
              <Button danger onClick={() => deleteNotification(item.id)}>O'chirish</Button>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.message}
            />
            <Badge status={item.read ? 'default' : 'processing'} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
