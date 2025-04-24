import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import { Table, Button, Spin, Tooltip, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface TeacherType {
  id: string | number;
  full_name?: string;
  name?: string;
  birthdate?: string;
  birthDate?: string;
  gender?: string;
  contact?: string;
  [key: string]: any;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<TeacherType | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/teacher");
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
      }
      setTeachers(data);
    } catch (err: any) {
      setError("O'qituvchilarni olishda xatolik");
      setToast({ message: err.message || "O'qituvchilarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/teacher/${id}`);
      setToast({ message: "O'qituvchi o'chirildi!", type: 'success' });
      fetchTeachers();
    } catch (err: any) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'F.I.Sh.', dataIndex: 'full_name', key: 'full_name', render: (_: any, record: TeacherType) => record.full_name || record.name },
    { title: "Tug‘ilgan sana", dataIndex: 'birthdate', key: 'birthdate', render: (_: any, record: TeacherType) => record.birthdate || record.birthDate },
    { title: 'Jinsi', dataIndex: 'gender', key: 'gender' },
    { title: 'Kontakt', dataIndex: 'contact', key: 'contact' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: TeacherType) => (
        <Space>
          <Tooltip title="Tahrirlash">
            <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => { setEditItem(record); setShowEdit(true); }} />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">O'qituvchilar</h2>
      <Button type="primary" className="mb-4" onClick={() => setShowAdd(true)}>+ O'qituvchi qo'shish</Button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={teachers}
          pagination={false}
          rowKey={(record) => String(record.id)}
          className="bg-white rounded shadow"
        />
      </Spin>
      {error && (
        <div className="text-red-600 font-semibold">{error}</div>
      )}
      <AddTeacherModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onTeacherAdded={fetchTeachers}
      />
      <EditTeacherModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        teacher={editItem}
        onTeacherEdited={fetchTeachers}
      />
    </div>
  );
};

export default Teachers;
