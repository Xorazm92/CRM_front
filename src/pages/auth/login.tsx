import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { required } from '../../utils/validation';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const { data } = await authService.login(values);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Tizimga kirish</h1>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Username" rules={[required]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Parol" rules={[required]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;