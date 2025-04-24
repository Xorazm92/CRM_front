import React, { useState, useEffect, useContext } from "react";
import images from "../../images/index.js";
import "./Header.css";
import { getUserFromCookie } from "./useCookieData";
import { SearchContext } from "../../context/SearchContext";

const Header = () => {
  const [user, setUser] = useState({
    name: "Guest",
    role: "Foydalanuvchi",
    avatar: images.user
  });
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    const cookieUser = getUserFromCookie();
    setUser({
      name: cookieUser?.name || cookieUser?.username || cookieUser?.userName || "Guest",
      role: cookieUser?.role || "Foydalanuvchi",
      avatar: cookieUser?.avatar_url || images.user
    });
    // Notifikatsiyalarni olish
    if (cookieUser?._id) {
      fetch(`/api/v1/notifications/${cookieUser._id}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(() => setNotifications([]));
    }
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleNotifClick = () => setNotifOpen(!notifOpen);

  return (
    <header className="top-header">
      <div className="search-bar">
        <img
          className="search-icon"
          src={images.search_icon}
          alt="Search Icon"
          width={24}
          style={{ cursor: "pointer" }}
        />
        <input
          type="text"
          placeholder="Qidiruv tizimi..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="user-info">
        <div className="notification-icons">
          <div className="icon-wrapper" style={{ position: "relative" }}>
            <img
              className="notification-icon"
              src={images.notification}
              alt="notification icon"
              width={24}
              onClick={handleNotifClick}
              style={{ cursor: "pointer" }}
            />
            <span className="notification-badge">
              {notifications.length > 0 ? notifications.length : null}
            </span>
            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: 8,
                  minWidth: 220,
                  zIndex: 1000,
                  padding: 10
                }}
              >
                <div style={{fontWeight: 600, marginBottom: 8}}>Bildirishnomalar</div>
                {notifications.length === 0 ? (
                  <div style={{ color: "#888" }}>Yangi bildirishnoma yo‘q</div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={notif.id || idx} style={{padding: "6px 0", borderBottom: "1px solid #eee"}}>
                      {notif.title || notif.message || "Yangi bildirishnoma"}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div className="user-details">
          <img
            src={user.avatar}
            alt="avatar"
            className="user-avatar"
            width={36}
            height={36}
            style={{ borderRadius: "50%", objectFit: "cover", marginRight: 10 }}
          />
          <div>
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
