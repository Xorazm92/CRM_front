// This file is deprecated. Please use profile/index.tsx instead.
// If you need a profile page, create profile/index.tsx

import { Card, Form, Input, Button, message } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../services/profile';
import { useEffect } from 'react';
import React from 'react';

const Profile = () => {
  const [form] = Form.useForm();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      message.success('Profil yangilandi!');
    }
  });

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card title="Profilim" loading={isLoading} style={{ maxWidth: 500, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="fullName" label="To'liq ism" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile;
