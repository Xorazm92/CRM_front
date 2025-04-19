import React, { useState } from "react";
import instance from "../../../api/axios";

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    group: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await instance.post("/student", form);
      onStudentAdded && onStudentAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="modal-content" style={{background:'#fff',padding:24,borderRadius:8,minWidth:320}}>
        <h3>Yangi o‘quvchi qo‘shish</h3>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="F.I.O" required />
          <input name="birthdate" value={form.birthdate} onChange={handleChange} placeholder="Tug‘ilgan sana" required />
          <input name="gender" value={form.gender} onChange={handleChange} placeholder="Jinsi" required />
          <input name="group" value={form.group} onChange={handleChange} placeholder="Guruh" required />
          {error && <div className="error" style={{color:'red'}}>{error}</div>}
          <div style={{display:'flex',gap:8}}>
            <button type="submit" disabled={loading}>{loading ? "Yuklanmoqda..." : "Qo‘shish"}</button>
            <button type="button" onClick={onClose}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
