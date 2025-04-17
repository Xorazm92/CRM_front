
import React from 'react';
import { Badge, Dropdown, List, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const items = {
    items: [
      {
        key: 'notifications',
        label: (
          <List
            size="small"
            dataSource={notifications.slice(0, 5)}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  markAsReadMutation.mutate(item.id);
                  navigate('/notifications');
                }}
                style={{ cursor: 'pointer' }}
              >
                <Typography.Text strong={!item.read}>
                  {item.title}
                </Typography.Text>
              </List.Item>
            )}
            footer={
              <Typography.Link onClick={() => navigate('/notifications')}>
                Barcha bildirishnomalarni ko'rish
              </Typography.Link>
            }
          />
        )
      }
    ]
  };

  return (
    <Dropdown menu={items} trigger={['click']} placement="bottomRight">
      <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
