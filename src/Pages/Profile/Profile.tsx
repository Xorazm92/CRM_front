import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Card, Spin, Typography, Descriptions, Avatar, Button, message } from "antd";

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
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/users/profile")
      .then(res => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    // TODO: implement logout logic
    message.info("Logout ishlanmagan — uni auth context orqali yozing!");
  };

  return (
    <Card className="max-w-lg mx-auto mt-8 shadow-lg">
      <Spin spinning={loading}>
        {profile ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={64} src={profile.avatar}>
                {profile.name?.[0]}
              </Avatar>
              <div>
                <Typography.Title level={4}>{profile.name} {profile.lastname}</Typography.Title>
                <Typography.Text type="secondary">{profile.role}</Typography.Text>
              </div>
            </div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Username">{profile.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{profile.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="Telefon">{profile.phone_number || '-'}</Descriptions.Item>
              <Descriptions.Item label="Manzil">{profile.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="Status">{profile.status || '-'}</Descriptions.Item>
            </Descriptions>
            <div className="flex justify-end mt-4">
              <Button danger onClick={handleLogout}>Chiqish</Button>
            </div>
          </>
        ) : (
          <Typography.Text>Ma'lumot topilmadi</Typography.Text>
        )}
      </Spin>
    </Card>
  );
};

export default Profile;
