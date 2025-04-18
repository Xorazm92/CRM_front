import { Card, Form, Input, Button, message } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../services/profile';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [form] = Form.useForm();
  const [profileData, setProfileData] = useState(null);
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onSuccess: (data) => {
      setProfileData(data);
      form.setFieldsValue(data);
    }
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      message.success('Profil yangilandi!');
    },
    onError: (error) => {
      message.error('Profilni yangilashda xatolik yuz berdi: ' + error.message);
    }
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (isError) return <div>Xatolik: {error.message}</div>;

  return (
    <div className="p-6">
      <Card title="Profil ma'lumotlari" className="max-w-2xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={profileData}
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
            <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;