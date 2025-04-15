
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from "../../store/useAuthStore";
import { instance } from '../../config/axios-instance';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const Login = () => {
    const { setUser, setToken } = useAuthStore();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const res = await authService.login(values);
            setUser(res.data.user);
            setToken(res.data.data.accessToken);
            navigate('/');
            message.success('Successfully logged in!');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error('Invalid credentials');
        }
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: '#f0f2f5' 
        }}>
            <Card style={{ width: 400 }}>
                <h1 style={{ textAlign: 'center', marginBottom: 24 }}>CRM Login</h1>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Username" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
