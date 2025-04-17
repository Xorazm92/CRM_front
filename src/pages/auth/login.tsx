import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);

  const onFinish = async (values: {username: string; password: string}) => {
    try {
      const { data } = await authService.login(values);
      const accessToken = data.access_token;
      localStorage.setItem('token', accessToken);
      setUser(data.user);
      setToken(accessToken);
      navigate('/');
      message.success('Tizimga muvaffaqiyatli kirdingiz!');
    } catch (err) {
      message.error('Login yoki parol xato!');
    }
  };

  return (
    <div className="login-page">
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Card style={{ width: 400, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', fontSize: 24, marginBottom: 30 }} className="login-title">CRM Tizimiga Kirish</h1>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Loginni kiriting!' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Login"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Parolni kiriting!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Parol"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Kirish
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;