import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import Cookie from "js-cookie";

const Login = () => {
    const { setUser, setToken } = useAuthStore((s) => s);
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const res = await authService.login(values);
            const user = res.data.data?.user;
            
            const accessToken = res.data.data?.accessToken;
            const refreshToken = res.data.data?.refreshToken;
            // console.log(user,accessToken,refreshToken);
            // Debug uchun user va role ni konsolga chiqaramiz
            console.log('LOGIN RESPONSE USER:', user);
            console.log('LOGIN RESPONSE ROLE:', user?.role);
            if (!user || !user.role) {
                message.error('User ma’lumotlari yoki role topilmadi!');
                return;
            }
            setUser(user);
            setToken(accessToken);
            Cookie.set("accessToken", accessToken);
            if (refreshToken) Cookie.set("refreshToken", refreshToken);

            // Role bo‘yicha yo‘naltirish va debug log
            switch(user.role) {
                case 'MANAGER':
                    console.log('Redirecting to /');
                    navigate('/', { replace: true });
                    break;
                case 'ADMIN':
                    console.log('Redirecting to /admin');
                    navigate('/admin', { replace: true });
                    break;
                case 'TEACHER':
                    console.log('Redirecting to /teachers');
                    navigate('/teachers', { replace: true });
                    break;
                case 'STUDENT':
                    console.log('Redirecting to /students');
                    navigate('/students', { replace: true });
                    break;
                default:
                    console.log('Redirecting to /');
                    navigate('/', { replace: true });
            }

            message.success('Successfully logged in!');
        } catch (error) {
            message.error('Invalid credentials');
            return;
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
                <div style={{
                  background: '#fffbe6',
                  border: '1px solid #ffe58f',
                  borderRadius: 6,
                  padding: 12,
                  marginBottom: 16,
                  textAlign: 'center',
                  color: '#ad6800',
                  fontWeight: 500
                }}>
                  Admin uchun: <b>username:</b> superadmin, <b>parol:</b> superadmin
                </div>
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
