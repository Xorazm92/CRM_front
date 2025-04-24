// Converted from Teachers/Teacher.jsx to Teachers/Teacher.tsx with TypeScript support
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import instance from "../../../api/axios";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddTeacherModal from "./AddTeacherModal";

interface TeacherType {
  user_id: string;
  name: string;
  lastname: string;
  middlename?: string;
  birthdate?: string;
  gender?: string;
  phone_number?: string;
}

const TeacherPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get(`/users?role=TEACHER&page=${page}&limit=${limit}`);
      setTeachers(res.data.data || res.data || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(err.message || "O‘qituvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleEdit = (teacher: TeacherType) => {
    // TODO: Edit modal yoki sahifaga yo'naltirish
  };

  const handleDelete = async (user_id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/api/v1/users/${user_id}`);
      fetchTeachers(currentPage, pageSize);
    } catch (err) {
      alert("O‘chirishda xatolik");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">O‘qituvchilar jadvali</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          onClick={() => setModalOpen(true)}
        >
          <PlusOutlined /> Qo‘shish
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm">
              <th className="py-3 px-4 text-left font-semibold">#</th>
              <th className="py-3 px-4 text-left font-semibold">O‘qituvchilar F.I.O</th>
              <th className="py-3 px-4 text-left font-semibold">Tug‘ilgan sana</th>
              <th className="py-3 px-4 text-left font-semibold">Jinsi</th>
              <th className="py-3 px-4 text-left font-semibold">Kontakt</th>
              <th className="py-3 px-4 text-center font-semibold">Imkoniyatlar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center"><Spin size="large" /></td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="py-8 text-center text-red-600">{error}</td></tr>
            ) : teachers.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center">Ma'lumot yo‘q</td></tr>
            ) : (
              teachers.map((t, idx) => (
                <tr key={t.user_id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold">
                      {t.name?.[0] || ''}
                    </span>
                    {t.lastname} {t.name} {t.middlename || ''}
                  </td>
                  <td className="py-3 px-4">{t.birthdate ? new Date(t.birthdate).toLocaleDateString() : ''}</td>
                  <td className={"py-3 px-4 " + (t.gender === "MALE" ? "text-teal-600" : "text-pink-500")}>{t.gender === "MALE" ? "O‘g‘il bola" : t.gender === "FEMALE" ? "Qiz bola" : ''}</td>
                  <td className="py-3 px-4">{t.phone_number || ''}</td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleEdit(t)}>
                      <EditOutlined className="text-xl text-blue-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded ml-2" onClick={() => handleDelete(t.user_id)}>
                      <DeleteOutlined className="text-xl text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">Sahifalar</div>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
          <span className="px-2">{currentPage}</span>
          <button disabled={currentPage === Math.ceil(total / pageSize) || total === 0} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
        </div>
        <div className="text-sm text-gray-500">{pageSize}</div>
      </div>
      <AddTeacherModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTeacherAdded={() => fetchTeachers(currentPage, pageSize)}
      />
    </div>
  );
};

export default TeacherPage;
