import React, { useState, useEffect } from "react";
import Toast from "../../../components/Toast";
import instance from "../../../api/axios";

const EditGroupModal = ({ isOpen, onClose, group, onGroupEdited }) => {
  const [form, setForm] = useState({ name: "", startDate: "", level: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (group) {
      setForm({
        name: group.name || "",
        startDate: group.startDate || "",
        level: group.level || ""
      });
    }
  }, [group]);

  const validate = () => {
    if (!form.name.trim()) return "Guruh nomi majburiy";
    if (!form.startDate.trim()) return "Boshlanish sanasi majburiy";
    if (!form.level.trim()) return "Daraja majburiy";
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setToast({ message: validationError, type: 'error' });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
      return;
    }
    setLoading(true);
    try {
      await instance.put(`/group/${group.id}`, form);
      onGroupEdited();
      setToast({ message: "Guruh muvaffaqiyatli tahrirlandi!", type: "success" });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Tahrirlashda xatolik");
      setToast({ message: err.response?.data?.message || "Tahrirlashda xatolik", type: 'error' });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="modal-content" style={{background:'#fff',padding:24,borderRadius:8,minWidth:320}}>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <h3>Guruhni tahrirlash</h3>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Guruh nomi" required />
          <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Boshlanish sanasi (YYYY-MM-DD)" required />
          <input name="level" value={form.level} onChange={handleChange} placeholder="Daraja" required />
          {error && <div className="error" style={{color:'red'}}>{error}</div>}
          <div style={{display:'flex',gap:8}}>
            <button type="submit" disabled={loading}>{loading ? "Yuklanmoqda..." : "Saqlash"}</button>
            <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGroupModal;
