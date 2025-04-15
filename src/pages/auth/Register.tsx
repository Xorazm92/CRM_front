
import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const onFinish = async (values: any) => {
    try {
      const res = await authService.register(values);
      setUser(res.data.user);
      setToken(res.data.data.accessToken);
      navigate('/');
      message.success('Successfully registered!');
    } catch (error) {
      message.error('Registration failed');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Register</h2>
        <Form name="register" onFinish={onFinish}>
          <Form.Item name="full_name" rules={[{ required: true, message: 'Please input your full name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <a href="/login">Login now!</a>
        </div>
      </Card>
    </div>
  );
};

export default Register;
