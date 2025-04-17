import React from 'react';
import { Badge, Dropdown, List, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const items = {
    items: notifications.map(notification => ({
      label: (
        <List.Item onClick={() => {
          markAsReadMutation.mutate(notification.id);
          navigate('/notifications');
        }}>
          <Typography.Text strong={!notification.read}>
            {notification.message}
          </Typography.Text>
        </List.Item>
      )
    }))
  };

  return (
    <Dropdown menu={items} trigger={['click']}>
      <Badge count={unreadCount} size="small">
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;