
import React, { useEffect, useState } from "react";
import { Card, Spin, Typography, Descriptions, Avatar, Button, message, Tabs, Form, Input, DatePicker, Select, Badge } from "antd";
import { UserOutlined, EditOutlined, LockOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import instance from "../../api/axios";
import dayjs from "dayjs";
import "./Profile.css";

interface ProfileType {
  user_id: string;
  username: string;
  name: string;
  lastname: string;
  middlename?: string;
  role: string;
  email?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  status?: string;
  birthdate?: string;
  gender?: string;
  passport?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const genderOptions = [
    { value: "MALE", label: "Erkak" },
    { value: "FEMALE", label: "Ayol" },
  ];
  const statusColors: Record<string, string> = {
    ACTIVE: "green",
    INACTIVE: "orange",
    BLOCKED: "red",
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/users/profile");
      setProfile(res.data);
      const data = res.data;
      form.setFieldsValue({
        ...data,
        birthdate: data.birthdate ? dayjs(data.birthdate) : undefined,
      });
    } catch (err) {
      message.error("Profil ma'lumotlarini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : undefined,
      };
      await instance.put("/users/profile", payload);
      message.success("Profil muvaffaqiyatli yangilandi");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      message.error("Profilni yangilashda xatolik yuz berdi");
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      await instance.post("/auth/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Parol muvaffaqiyatli o'zgartirildi");
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Parolni o'zgartirishda xatolik");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Faqat rasm faylini yuklang!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    setUploadingAvatar(true);
    try {
      await instance.post("/users/avatar", formData);
      message.success("Profil rasmi yangilandi");
      fetchProfile();
    } catch (err) {
      message.error("Rasmni yuklashda xatolik");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Spin spinning={loading}>
          {profile ? (
            <Tabs defaultActiveKey="info">
              <Tabs.TabPane tab="Asosiy ma'lumotlar" key="info">
                <div className="profile-header">
                  <div className="avatar-section">
                    <Spin spinning={uploadingAvatar}>
                      <Avatar 
                        size={100} 
                        src={profile.avatar}
                        icon={<UserOutlined />}
                        className="profile-avatar"
                      />
                      <label className="avatar-upload">
                        <EditOutlined />
                        <input 
                          type="file" 
                          hidden 
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </Spin>
                  </div>
                  <div className="profile-title">
                    <Typography.Title level={3}>
                      {profile.name} {profile.lastname}
                    </Typography.Title>
                    <Typography.Text type="secondary">{profile.role}</Typography.Text>
                  </div>
                </div>

                {editMode ? (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    className="profile-form"
                  >
                    <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy" }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy" }]}> 
                      <Input />
                    </Form.Item>
                    <Form.Item name="middlename" label="Otasining ismi"> 
                      <Input />
                    </Form.Item>
                    <Form.Item name="passport" label="Passport seriya raqami"> 
                      <Input maxLength={15} placeholder="AA1234567" />
                    </Form.Item>
                    <Form.Item name="birthdate" label="Tug'ilgan sana">
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="gender" label="Jinsi">
                      <Select options={genderOptions} placeholder="Tanlang" allowClear />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', message: "Email noto'g'ri kiritilgan" }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="phone_number" label="Telefon" rules={[{ pattern: /^\+?\d{9,15}$/, message: "Telefon raqami noto'g'ri!" }]}> 
                      <Input placeholder="Masalan, +998901234567" />
                    </Form.Item>
                    <Form.Item name="address" label="Manzil">
                      <Input />
                    </Form.Item>
                    <div className="form-actions">
                      <Button onClick={() => setEditMode(false)} icon={<CloseOutlined />}>
                        Bekor qilish
                      </Button>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Saqlash
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="Username">{profile.username}</Descriptions.Item>
                      <Descriptions.Item label="Ism">{profile.name}</Descriptions.Item>
                      <Descriptions.Item label="Familiya">{profile.lastname}</Descriptions.Item>
                      <Descriptions.Item label="Otasining ismi">{profile.middlename || '-'}</Descriptions.Item>
                      <Descriptions.Item label="Passport">{profile.passport || '-'}</Descriptions.Item>
                      <Descriptions.Item label="Tug'ilgan sana">{profile.birthdate ? dayjs(profile.birthdate).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
                      <Descriptions.Item label="Jinsi">{profile.gender === 'MALE' ? 'Erkak' : profile.gender === 'FEMALE' ? 'Ayol' : '-'}</Descriptions.Item>
                      <Descriptions.Item label="Email">{profile.email || '-'}</Descriptions.Item>
                      <Descriptions.Item label="Telefon">{profile.phone_number || '-'}</Descriptions.Item>
                      <Descriptions.Item label="Manzil">{profile.address || '-'}</Descriptions.Item>
                      <Descriptions.Item label="Rol">{profile.role}</Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Badge color={statusColors[profile.status || 'ACTIVE'] || 'blue'} text={profile.status || '-'} />
                      </Descriptions.Item>
                    </Descriptions>
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                      className="edit-button"
                    >
                      Tahrirlash
                    </Button>
                  </>
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Parolni o'zgartirish" key="password">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                  className="password-form"
                >
                  <Form.Item
                    name="oldPassword"
                    label="Joriy parol"
                    rules={[{ required: true, message: "Joriy parol majburiy" }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Joriy parolni kiriting" />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label="Yangi parol"
                    rules={[
                      { required: true, message: "Yangi parol majburiy" },
                      { min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Yangi parol" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Yangi parolni tasdiqlang"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: "Parolni tasdiqlash majburiy" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Parollar mos kelmadi");
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Yangi parolni qayta kiriting" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Parolni o'zgartirish
                  </Button>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <Typography.Text>Ma'lumot topilmadi</Typography.Text>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default Profile;
