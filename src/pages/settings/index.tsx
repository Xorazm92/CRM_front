
import { Card, Form, Input, Button, message, Tabs } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';

const Settings = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      message.success('Profil muvaffaqiyatli yangilandi');
      // Update local user data
      setUser({
        ...user,
        full_name: form.getFieldValue('full_name'),
        username: form.getFieldValue('username'),
      });
    },
    onError: () => {
      message.error('Xatolik yuz berdi');
    }
  });

  const handleProfileUpdate = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  const items = [
    {
      key: '1',
      label: 'Profil',
      children: (
        <Card title="Profil ma'lumotlari" style={{ maxWidth: 600 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              full_name: user.full_name,
              username: user.username,
            }}
            onFinish={handleProfileUpdate}
          >
            <Form.Item
              label="Ism Familiya"
              name="full_name"
              rules={[{ required: true, message: 'Iltimos, ism familiyangizni kiriting' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Foydalanuvchi nomi"
              name="username"
              rules={[{ required: true, message: 'Iltimos, foydalanuvchi nomini kiriting' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Yangi parol"
              name="password"
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Saqlash
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Tizim',
      children: (
        <Card title="Tizim sozlamalari">
          <p>Tizim sozlamalari tez orada qo'shiladi</p>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Tabs items={items} />
    </div>
  );
};

export default Settings;
