import React, { useState, useEffect, useContext } from "react";
import { Input, Badge, Avatar, Dropdown, List } from "antd";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import images from "../../images";
import { getUserFromCookie } from "./useCookieData";
import { SearchContext } from "../../context/SearchContext";

const Header: React.FC = () => {
  const [user, setUser] = useState({
    name: "Guest",
    role: "Foydalanuvchi",
    avatar: images.user
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    const cookieUser = getUserFromCookie();
    setUser({
      name: cookieUser?.name || cookieUser?.username || cookieUser?.userName || "Guest",
      role: cookieUser?.role || "Foydalanuvchi",
      avatar: cookieUser?.avatar_url || images.user
    });
    if (cookieUser?._id) {
      fetch(`/api/v1/notifications/${cookieUser._id}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(() => setNotifications([]));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const notificationMenu = (
    <div className="bg-white rounded shadow-md p-2 min-w-[220px]">
      <div className="font-semibold mb-2">Bildirishnomalar</div>
      {notifications.length === 0 ? (
        <div className="text-gray-400">Yangi bildirishnoma yo‘q</div>
      ) : (
        <List
          size="small"
          dataSource={notifications}
          renderItem={(notif: any, idx: number) => (
            <List.Item key={notif.id || idx} className="border-b last:border-b-0">
              {notif.title || notif.message || "Yangi bildirishnoma"}
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b">
      <div className="flex items-center gap-2 w-1/2">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Qidiruv tizimi..."
          value={search}
          onChange={handleSearch}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-6">
        <Dropdown
          overlay={notificationMenu}
          trigger={["click"]}
          open={notifOpen}
          onOpenChange={setNotifOpen}
        >
          <Badge count={notifications.length} size="small">
            <BellOutlined className="text-2xl text-gray-600 cursor-pointer" />
          </Badge>
        </Dropdown>
        <div className="flex items-center gap-2">
          <Avatar src={user.avatar} icon={<UserOutlined />} size={36} />
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{user.name}</span>
            <span className="text-xs text-gray-500">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
