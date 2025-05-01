
import React, { useEffect, useState } from 'react';
import { Card, Tabs, Form, Input, Button, Select, Switch, message, Divider, DatePicker, Avatar, Spin, Upload } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined, BellOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import instance from '../../api/axios';
import dayjs from 'dayjs';
import './Settings.css';

const { TabPane } = Tabs;
const genderOptions = [
  { value: 'MALE', label: 'Erkak' },
  { value: 'FEMALE', label: 'Ayol' },
];

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await instance.get('/users/profile');
      setProfile(res.data);
      form.setFieldsValue({
        ...res.data,
        birthdate: res.data.birthdate ? dayjs(res.data.birthdate) : undefined,
      });
    } catch (err) {
      message.error("Profil ma'lumotlarini yuklashda xatolik");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : undefined,
      };
      await instance.put('/users/profile', payload);
      message.success("Profil ma'lumotlari yangilandi");
      fetchProfile();
    } catch (err) {
      message.error("Profilni yangilashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await instance.post('/auth/change-password', {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      message.success("Parol muvaffaqiyatli o'zgartirildi");
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Parolni o'zgartirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (info: any) => {
    const file = info.file.originFileObj;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      message.error("Faqat rasm faylini yuklang!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarUploading(true);
    try {
      await instance.post('/users/avatar', formData);
      message.success("Profil rasmi yangilandi");
      fetchProfile();
    } catch (err) {
      message.error("Rasmni yuklashda xatolik");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleNotificationSave = async (values: any) => {
    message.success("Bildirishnoma sozlamalari saqlandi (demo)");
    // Bu yerda backendga yuborish uchun API chaqiruvi yozish mumkin
  };

  return (
    <div className="settings-container">
      <Card className="settings-card">
        <Tabs defaultActiveKey="profile">
          <TabPane tab={<span><UserOutlined />Profil sozlamalari</span>} key="profile">
            <Spin spinning={profileLoading}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                <Spin spinning={avatarUploading}>
                  <Avatar
                    size={80}
                    src={profile?.avatar}
                    icon={<UserOutlined />}
                    style={{ background: '#e6f7ff' }}
                  />
                  <Upload
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      handleAvatarChange({ file: { originFileObj: file } });
                      setTimeout(() => onSuccess && onSuccess('ok'), 0);
                    }}
                  >
                    <Button icon={<UploadOutlined />} size="small" style={{ marginTop: 8 }}>
                      Rasm yuklash
                    </Button>
                  </Upload>
                </Spin>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{profile?.name} {profile?.lastname}</div>
                  <div style={{ color: '#888' }}>{profile?.role}</div>
                </div>
              </div>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleProfileUpdate}
                className="settings-form"
              >
                <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy" }]}> <Input /> </Form.Item>
                <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy" }]}> <Input /> </Form.Item>
                <Form.Item name="middlename" label="Otasining ismi"> <Input /> </Form.Item>
                <Form.Item name="passport" label="Passport seriya raqami"> <Input maxLength={15} placeholder="AA1234567" /> </Form.Item>
                <Form.Item name="birthdate" label="Tug'ilgan sana">
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="gender" label="Jinsi">
                  <Select options={genderOptions} placeholder="Tanlang" allowClear />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: "Email noto'g'ri kiritilgan" }]}> <Input /> </Form.Item>
                <Form.Item name="phone_number" label="Telefon" rules={[{ pattern: /^\+?\d{9,15}$/, message: "Telefon raqami noto'g'ri!" }]}> <Input placeholder="Masalan, +998901234567" /> </Form.Item>
                <Form.Item name="address" label="Manzil"> <Input /> </Form.Item>
                <Divider />
                <Form.Item name="language" label="Tizim tili">
                  <Select
                    options={[
                      { value: 'uz', label: "O'zbek" },
                      { value: 'ru', label: 'Русский' },
                      { value: 'en', label: 'English' }
                    ]}
                  />
                </Form.Item>
                <Form.Item name="theme" label="Tashqi ko'rinish">
                  <Select
                    options={[
                      { value: 'light', label: 'Yorqin' },
                      { value: 'dark', label: "Qorong'u" }
                    ]}
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Saqlash
                </Button>
              </Form>
            </Spin>
          </TabPane>

          <TabPane tab={<span><LockOutlined />Xavfsizlik</span>} key="security">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
              className="settings-form"
            >
              <Form.Item
                name="currentPassword"
                label="Joriy parol"
                rules={[{ required: true, message: 'Joriy parolni kiriting' }]}
              >
                <Input.Password placeholder="Joriy parol" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Yangi parol"
                rules={[
                  { required: true, message: 'Yangi parolni kiriting' },
                  { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }
                ]}
              >
                <Input.Password placeholder="Yangi parol" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Yangi parolni tasdiqlang"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Parolni tasdiqlang' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Parollar mos kelmadi');
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Yangi parolni qayta kiriting" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Parolni o'zgartirish
              </Button>
            </Form>
          </TabPane>

          <TabPane tab={<span><BellOutlined />Bildirishnomalar</span>} key="notifications">
            <Form layout="vertical" className="settings-form" form={notificationForm} onFinish={handleNotificationSave}>
              <Form.Item name="emailNotifications" label="Email bildirishnomalari" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="smsNotifications" label="SMS bildirishnomalari" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Button type="primary" htmlType="submit">Saqlash</Button>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
