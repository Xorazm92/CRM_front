import { Card, Form, Input, Button, message } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth';

const Settings = () => {
  const { user, setUser } = useAuthStore();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await authService.updateProfile(values);
      setUser({ ...user, ...values });
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Profile Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            full_name: user.full_name,
            username: user.username
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="password"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;