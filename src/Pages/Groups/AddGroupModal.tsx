// Migration placeholder for AddGroupModal.jsx to .tsx
// The actual code will be migrated from the .jsx file and refactored to TypeScript.

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./Groups.css";

// Types for teacher and course objects based on backend schema
interface Teacher {
  user_id: string;
  full_name?: string;
  name?: string;
  [key: string]: any;
}

interface Course {
  course_id: string;
  name: string;
  [key: string]: any;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded?: () => void;
}

interface FormState {
  name: string;
  description: string;
  course_id: string;
  status: string;
  start_date: string;
  teacher_id: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onGroupAdded }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    course_id: "",
    status: "ACTIVE",
    start_date: "",
    teacher_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string }>({ message: '', type: 'success' });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (isOpen) {
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
      });
      instance.get("/course").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setCourses(data);
      });
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.course_id || !form.teacher_id || !form.start_date) {
      setToast({ message: "Barcha majburiy maydonlarni to‘ldiring", type: "error" });
      return;
    }
    if (!form.description || form.description.length < 10) {
      setToast({ message: "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak", type: "error" });
      return;
    }
    setLoading(true);
    try {
      // Use backend schema: course_id, teacher_id must match backend IDs
      const selectedCourse = courses.find(c => c.course_id === form.course_id);
      const selectedTeacher = teachers.find(t => t.user_id === form.teacher_id);
      const payload = {
        ...form,
        course_id: selectedCourse ? selectedCourse.course_id : '',
        teacher_id: selectedTeacher ? selectedTeacher.user_id : ''
      };
      // Send only required fields
      await instance.post("/groups", payload);
      setToast({ message: "Guruh muvaffaqiyatli qo'shildi!", type: "success" });
      setForm({
        name: "",
        description: "",
        course_id: "",
        status: "ACTIVE",
        start_date: "",
        teacher_id: ""
      });
      if (onGroupAdded) onGroupAdded();
      if (onClose) onClose();
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || err.message || "Xatolik yuz berdi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal add-group-modal">
        <h2>Yangi guruh qo'shish</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Guruh nomi" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Tavsif (kamida 10 ta belgi)" value={form.description} onChange={handleChange} required />
          <select name="course_id" value={form.course_id} onChange={handleChange} required>
            <option value="">Kurs tanlang</option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id}>{c.name}</option>
            ))}
          </select>
          <select name="teacher_id" value={form.teacher_id} onChange={handleChange} required>
            <option value="">O‘qituvchi tanlang</option>
            {teachers.map(t => (
              <option key={t.user_id} value={t.user_id}>{t.full_name || t.name}</option>
            ))}
          </select>
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Aktiv</option>
            <option value="INACTIVE">Passiv</option>
          </select>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Bekor qilish</button>
            <button type="submit" disabled={loading}>{loading ? <ClipLoader size={16} color="#fff" /> : "Qo'shish"}</button>
          </div>
        </form>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </div>
  );
};

export default AddGroupModal;
