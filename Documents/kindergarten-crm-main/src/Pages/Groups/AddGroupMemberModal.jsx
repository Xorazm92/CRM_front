import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";

const AddGroupMemberModal = ({ isOpen, onClose, groupId, onMembersAdded }) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      instance.get("/student").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setStudents(data);
      }).catch(async () => {
        try {
          const res2 = await instance.get("/api/v1/student");
          let data2 = res2.data;
          if (!Array.isArray(data2)) {
            if (data2 && Array.isArray(data2.data)) {
              data2 = data2.data;
            } else {
              data2 = [];
            }
          }
          setStudents(data2);
        } catch {
          setStudents([]);
        }
      });
    }
  }, [isOpen]);

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected.length) {
      setToast({ message: "Kamida bitta o'quvchini tanlang", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Debug: yuborilayotgan payloadni ko'rsatamiz
      console.log({ group_id: groupId, user_ids: selected });
      await instance.post("/admin/addMembersToGroup", {
        group_id: groupId,
        user_ids: selected
      });
      setToast({ message: "A'zolar muvaffaqiyatli qo'shildi!", type: 'success' });
      onMembersAdded && onMembersAdded();
      onClose();
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Qo'shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="modal-content" style={{background:'#fff',padding:24,borderRadius:8,minWidth:320,maxWidth:400}}>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <h3>Guruhga a'zo qo'shish</h3>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12,maxHeight:400,overflowY:'auto'}}>
          <div style={{marginBottom:8}}>
            {students.length === 0 ? (
              <div style={{color:'#888'}}>O'quvchilar topilmadi</div>
            ) : (
              students.map((s) => {
                const studentId = s.id || s.student_id || s.user_id || s._id;
                if (!studentId) return null;
                return (
                  <label key={studentId} style={{display:'block',marginBottom:4}}>
                    <input
                      type="checkbox"
                      checked={selected.includes(studentId)}
                      onChange={() => handleSelect(studentId)}
                    /> {s.full_name || s.name || s.username || 'No name'}
                  </label>
                );
              })
            )}
          </div>
          <div style={{display:'flex',gap:8}}>
            <button type="submit" disabled={loading}>{loading ? <ClipLoader size={16} color="#fff" /> : "+ Qo'shish"}</button>
            <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupMemberModal;
