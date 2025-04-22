import React, { useEffect, useState } from "react";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/notifications/${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(() => setError("Bildirishnomalarni olishda xatolik"))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div style={{display:'inline-block'}}>
      <button onClick={() => setShow(!show)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>
        <span role="img" aria-label="bell">🔔</span>
        {notifications.length > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0, background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: 12
          }}>{notifications.length}</span>
        )}
      </button>
      {show && (
        <div className="notifications-modal" style={{position:'absolute',zIndex:100,background:'#fff',boxShadow:'0 2px 8px #0002',padding:12,minWidth:220}}>
          <h4>Bildirishnomalar</h4>
          {loading ? <div>Yuklanmoqda...</div> : error ? <div>{error}</div> : notifications.length === 0 ? (
            <div>Yangi xabar yo‘q</div>
          ) : (
            <ul style={{margin:0,padding:0,listStyle:'none'}}>
              {notifications.map(n => (
                <li key={n.id} style={{padding:'6px 0',borderBottom:'1px solid #eee'}}>{n.text || n.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
