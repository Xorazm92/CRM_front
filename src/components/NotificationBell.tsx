
import React from 'react';
import { Badge, Dropdown, List, Typography, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll,
    refetchInterval: 30000 // Har 30 sekundda yangilanadi
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      notification.success({ message: "O'qildi deb belgilandi" });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const items = {
    items: notifications.slice(0, 5).map((notification) => ({
      key: notification.id,
      label: (
        <List.Item
          onClick={() => {
            markAsReadMutation.mutate(notification.id);
            navigate('/notifications');
          }}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <Typography.Text strong={!notification.read}>
            {notification.message}
          </Typography.Text>
        </List.Item>
      )
    })),
    footer: {
      key: 'footer',
      label: (
        <Typography.Link 
          onClick={() => navigate('/notifications')}
          style={{ display: 'block', textAlign: 'center', padding: '8px' }}
        >
          Barcha bildirishnomalarni ko'rish
        </Typography.Link>
      )
    }
  };

  return (
    <Dropdown menu={items} trigger={['click']} placement="bottomRight">
      <Badge count={unreadCount} offset={[-5, 5]}>
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
