
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const onFinish = async (values: any) => {
    try {
      // Mock login for now
      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 1,
          username: values.username,
          role: 'ADMIN'
        }
      };
      
      setToken(mockResponse.token);
      setUser(mockResponse.user);
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      message.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      message.error('Login failed');
    }
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="login-form"
      >
        <h1 className="login-title">Welcome Back</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
