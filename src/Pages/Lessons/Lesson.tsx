import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddLessonModal from "./AddLessonModal";
import EditLessonModal from "./EditLessonModal";
import AttendanceModal from "./AttendanceModal";
import icons from "../../images/icons";

interface Lesson {
  lesson_id?: string;
  id?: string;
  topic: string;
  group_id: string;
  lesson_date?: string;
  recording_path: string;
}

const Lesson = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<Lesson | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [attendanceLesson, setAttendanceLesson] = useState<Lesson | null>(null);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/lesson");
      let data = res.data;
      let lessonsArray = Array.isArray(data.data) ? data.data : [];
      setLessons(lessonsArray);
    } catch (err) {
      setError("Darslarni olishda xatolik");
      setToast({ message: err.response?.data?.message || err.message || "Darslarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Guruhlarni olish
  useEffect(() => {
    instance.get('/groups').then(res => {
      let data = res.data.data || [];
      setGroups(data);
    });
  }, []);

  useEffect(() => {
    fetchLessons();
  }, []);

  // Guruh nomini id orqali topish uchun funksiya
  const getGroupName = (group_id: string) => {
    const g = groups.find(g => g.group_id === group_id || g._id === group_id);
    return g ? g.name : group_id;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/lesson/${id}`);
      setToast({ message: "Dars o'chirildi!", type: 'success' });
      fetchLessons();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lesson-wrapper">
      <div className="header-lesson-page">
        <h2><img src={icons.lesson} alt="Darslar" style={{width:28,verticalAlign:'middle',marginRight:8}} /> Darslar</h2>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          <span style={{fontSize:22,marginRight:6}}>+</span> Dars qo'shish
        </button>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="lesson-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mavzu</th>
                <th>Guruh</th>
                <th>Sana</th>
                <th>Yozuv yo‘li</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(lessons) || lessons.length === 0) ? (
                <tr><td colSpan="6">Darslar topilmadi</td></tr>
              ) : lessons.map((l, i) => (
                <tr key={l.lesson_id || l.id}>
                  <td>{i + 1}</td>
                  <td>{l.topic}</td>
                  <td>{getGroupName(l.group_id)}</td>
                  <td>{l.lesson_date ? new Date(l.lesson_date).toLocaleString() : ''}</td>
                  <td>{l.recording_path}</td>
                  <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => { setEditItem(l); setShowEdit(true); }} title="Tahrirlash" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <img src={icons.pen} alt="edit" width={22} height={22} />
                    </button>
                    <button onClick={() => handleDelete(l.lesson_id || l.id)} title="O'chirish" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <img src={icons.delete} alt="delete" width={22} height={22} />
                    </button>
                    <button className="attendance-btn" onClick={() => setAttendanceLesson(l)}>Davomat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddLessonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchLessons}
      />
      <EditLessonModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchLessons}
        lesson={editItem}
      />
      <AttendanceModal
        open={!!attendanceLesson}
        lesson={attendanceLesson}
        groupId={attendanceLesson?.group_id}
        onClose={() => setAttendanceLesson(null)}
        onSuccess={fetchLessons}
      />
    </div>
  );
};

export default Lesson;
