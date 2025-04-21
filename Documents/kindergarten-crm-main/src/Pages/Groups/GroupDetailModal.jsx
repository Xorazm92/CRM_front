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
      instance.get(`/admin/group/${groupId}`)
        .then(res => {
          const data = res.data.data || res.data;
          // O'qituvchi obyektini olish
          let teacher = data.teacher;
          if (!teacher && data.teacher_name) {
            teacher = { name: data.teacher_name };
          } else if (!teacher && data.teacher_id) {
            teacher = { id: data.teacher_id };
          }
          // O'quvchilar ro'yxatini group_members orqali yasash
          let students = [];
          if (Array.isArray(data.group_members)) {
            students = data.group_members.map(gm => gm.user);
          }
          setGroup({ ...data, teacher, students });
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
      <div className="modal-content">
        <button onClick={onClose} style={{float:'right',background:'none',border:'none',fontSize:22,cursor:'pointer',position:'absolute',top:18,right:18}}>&times;</button>
        <h2>Guruh tafsilotlari</h2>
        {loading ? (
          <div style={{textAlign:'center',minHeight:120,display:'flex',alignItems:'center',justifyContent:'center'}}><ClipLoader size={32} color="#009688" /></div>
        ) : error ? (
          <div style={{color:'#e53935',minHeight:120,display:'flex',alignItems:'center',justifyContent:'center'}}>{error}</div>
        ) : group ? (
          <>
            <div style={{marginBottom:16,fontSize:16}}>
              <b>Guruh nomi:</b> {group.name || '-'}<br/>
              <b>O'qituvchi:</b> {group.teacher?.name || group.teacher?.username || group.teacher?.user_id || '-'}<br/>
              <b>Boshlanish sanasi:</b> {group.start_date || group.startDate || '-'}
            </div>
            <div>
              <b>O'quvchilar ro'yxati:</b>
              {group.students && group.students.length > 0 ? (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',marginTop:8,borderCollapse:'collapse',background:'#fafbfc'}}>
                    <thead>
                      <tr>
                        <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'6px'}}>#</th>
                        <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'6px'}}>Ism</th>
                        <th style={{borderBottom:'1px solid #eee',textAlign:'left',padding:'6px'}}>Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.students.map((s, idx) => (
                        <tr key={s.user_id || s.id || idx}>
                          <td style={{padding:'6px'}}>{idx + 1}</td>
                          <td style={{padding:'6px'}}>{s.name || '-'}</td>
                          <td style={{padding:'6px'}}>{s.username || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
