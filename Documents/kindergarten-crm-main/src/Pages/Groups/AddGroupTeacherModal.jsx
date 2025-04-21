import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";

const AddGroupTeacherModal = ({ isOpen, onClose, groupId, onTeacherAdded }) => {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      setSelected("");
      instance.get("/teacher").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setTeachers(data);
      }).catch(() => setTeachers([]));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      setToast({ message: "O'qituvchini tanlang", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Debug: yuborilayotgan payloadni ko'rsatamiz
      console.log({ group_id: groupId, teacher_id: selected });
      await instance.post("/admin/addTeacherToGroup", {
        group_id: groupId,
        teacher_id: selected
      });
      setToast({ message: "O'qituvchi muvaffaqiyatli qo'shildi!", type: 'success' });
      onTeacherAdded && onTeacherAdded();
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
      <div className="modal-content">
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <h3>Guruhga o'qituvchi biriktirish</h3>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{marginBottom:8}}>
            <select value={selected} onChange={e => setSelected(e.target.value)} style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #ccc',fontSize:15}}>
              <option value="">O'qituvchini tanlang</option>
              {teachers.map((t) => (
                <option key={t.id || t.teacher_id || t.user_id} value={t.id || t.teacher_id || t.user_id}>
                  {t.full_name || t.name || t.username || 'No name'}
                </option>
              ))}
            </select>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button type="submit" disabled={loading} style={{background:'#009688',color:'#fff',padding:'7px 18px',borderRadius:6,border:'none',fontSize:15}}>{loading ? <ClipLoader size={16} color="#fff" /> : "+ Qo'shish"}</button>
            <button type="button" onClick={onClose} disabled={loading} style={{background:'#eee',color:'#222',padding:'7px 18px',borderRadius:6,border:'none',fontSize:15}}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupTeacherModal;
