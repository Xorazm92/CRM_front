import React from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';

// This component is disabled. Registration is not allowed.
export default function Register() {
  return (
    <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5'}}>
      <div style={{background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 6, padding: 32, textAlign: 'center'}}>
        <h2>Ro'yxatdan o'tish o'chirilgan</h2>
        <p>Iltimos, login orqali tizimga kiring.</p>
      </div>
    </div>
  );
}
