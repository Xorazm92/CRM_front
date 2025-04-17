
import React from 'react';
import { List, Card, Badge, Typography, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '../../services/notifications';
import { BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll
  });

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <BellOutlined style={{ fontSize: 24 }} />
        <Title level={3} style={{ margin: 0 }}>Bildirishnomalar</Title>
      </Space>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={notifications}
        loading={isLoading}
        renderItem={(notification) => (
          <List.Item>
            <Badge dot={!notification.read}>
              <Card>
                <Card.Meta
                  title={notification.title}
                  description={notification.message}
                />
                <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </Card>
            </Badge>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
