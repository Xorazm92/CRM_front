import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";

const statusOptions = [
  { value: "PRESENT", label: "Keldi" },
  { value: "ABSENT", label: "Kelmadi" },
  { value: "LATE", label: "Kechikdi" },
  { value: "EXCUSED", label: "Sababli" },
];

export default function AttendanceModal({ open, onClose, lesson, groupId, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !groupId) return;
    setLoading(true);
    instance.get(`/groups/${groupId}`)
      .then(res => {
        // Guruh a'zolari: res.data.data.students
        const members = res.data.data.students || [];
        setStudents(members);
        // Eski davomatni olish
        return instance.get(`/attendance?lesson_id=${lesson.lesson_id || lesson.id}`);
      })
      .then(res => {
        setAttendance(res.data || []);
      })
      .catch(() => setError("Ma'lumotlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, [open, groupId, lesson]);

  const handleChange = (student_id, status) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.student_id === student_id);
      if (exists) {
        return prev.map(a => a.student_id === student_id ? { ...a, status } : a);
      } else {
        return [...prev, { student_id, status }];
      }
    });
  };

  const handleSave = () => {
    setSaving(true);
    const lessonId = lesson.lesson_id || lesson.id;
    const payload = attendance
      .filter(a => a.status && a.student_id && lessonId)
      .map(a => ({
        lesson_id: lessonId,
        student_id: a.student_id,
        status: a.status
      }));

    if (payload.length === 0) {
      alert("Hech bir o‘quvchiga status tanlanmagan yoki ma'lumotlar to‘liq emas!");
      setSaving(false);
      return;
    }

    console.log("Yuborilayotgan attendance payload:", payload);

    // Har bir attendance uchun alohida POST yuborish
    Promise.all(payload.map(item => instance.post("/attendance", item)))
      .then(() => {
        alert("Davomat saqlandi");
        onSuccess && onSuccess();
        onClose();
      })
      .catch((err) => {
        alert("Saqlashda xatolik: " + (err?.response?.data?.message || ''));
        console.error(err?.response?.data);
      })
      .finally(() => setSaving(false));
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal attendance-modal">
        <h2>Davomat</h2>
        {loading ? <ClipLoader /> : error ? <div>{error}</div> : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="4">O'quvchilar topilmadi</td></tr>
              ) : students.map((s, i) => (
                <tr key={s.user_id || s.id || i}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.lastname}</td>
                  <td>
                    <select
                      value={attendance.find(a => a.student_id === (s.user_id || s.id))?.status || ""}
                      onChange={e => handleChange(s.user_id || s.id, e.target.value)}
                    >
                      <option value="">Tanlang</option>
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-actions">
          <button onClick={onClose} disabled={saving}>Bekor qilish</button>
          <button onClick={handleSave} disabled={saving || loading}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}
