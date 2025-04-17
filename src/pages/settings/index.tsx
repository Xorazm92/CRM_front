
import React from 'react';
import { Card, Form, Input, Button, Switch, Divider, message } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { profileService } from '../../services/profile';

const Settings = () => {
  const [form] = Form.useForm();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateSettings,
    onSuccess: () => {
      message.success('Sozlamalar muvaffaqiyatli yangilandi');
    }
  });

  const onFinish = (values: any) => {
    updateMutation.mutate(values);
  };

  return (
    <Card title="Sozlamalar" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={profile?.settings}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email xabarnomalar"
          name="emailNotifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Divider />

        <Form.Item
          label="Telefon raqam"
          name="phone"
          rules={[{ required: true, message: 'Iltimos telefon raqamingizni kiriting' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Telegram username"
          name="telegram"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;
