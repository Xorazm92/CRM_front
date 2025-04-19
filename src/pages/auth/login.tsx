import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const onFinish = async (values: any) => {
    try {
      const response = await authService.login(values.username, values.password);
      setToken(response.token);
      setUser(response.user);
      // localStorage'ga ham token va user saqlab qo'yamiz
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <h1>Login</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
