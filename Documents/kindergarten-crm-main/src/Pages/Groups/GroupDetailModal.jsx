import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";

const GroupDetailModal = ({ groupId, isOpen, onClose }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && groupId) {
      setLoading(true);
      setError("");
      instance.get(`/groups/${groupId}`)
        .then(res => {
          setGroup(res.data.data || res.data); // backend structure fallback
        })
        .catch(err => {
          setError("Ma'lumotlarni olishda xatolik");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, groupId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="modal-content" style={{background:'#fff',padding:24,borderRadius:8,minWidth:350,maxWidth:500}}>
        <button onClick={onClose} style={{float:'right',background:'none',border:'none',fontSize:22,cursor:'pointer'}}>&times;</button>
        <h2 style={{marginTop:0}}>Guruh tafsilotlari</h2>
        {loading ? (
          <div style={{textAlign:'center'}}><ClipLoader size={32} color="#009688" /></div>
        ) : error ? (
          <div style={{color:'#e53935'}}>{error}</div>
        ) : group ? (
          <>
            <div style={{marginBottom:12}}>
              <b>Guruh nomi:</b> {group.name || '-'}<br/>
              <b>O'qituvchi:</b> {group.teacher?.full_name || group.teacher?.name || group.teacher_name || '-'}<br/>
              <b>Boshlanish sanasi:</b> {group.start_date || group.startDate || '-'}
            </div>
            <div>
              <b>O'quvchilar ro'yxati:</b>
              {group.students && group.students.length > 0 ? (
                <table style={{width:'100%',marginTop:8,borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'4px'}}>#</th>
                      <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'4px'}}>Ism</th>
                      <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'4px'}}>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.students.map((s, idx) => (
                      <tr key={s.id || s.user_id || idx}>
                        <td style={{padding:'4px'}}>{idx + 1}</td>
                        <td style={{padding:'4px'}}>{s.full_name || s.name || '-'}</td>
                        <td style={{padding:'4px'}}>{s.username || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{color:'#888',marginTop:8}}>
                  O'quvchilar topilmadi
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GroupDetailModal;
