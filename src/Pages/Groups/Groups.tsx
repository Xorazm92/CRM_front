import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import GroupDetailModal from "./GroupDetailModal";
import { Table, Input, Spin, Modal, Button } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/Button/Button";
import "./Groups.css";
import AddAttendanceModal from "../Attendance/AddAttendanceModal";
import { useAuthStore } from "../../store/useAuthStore";

export type GroupType = {
  group_id: string;
  name: string;
  description: string;
  status: string;
  start_date?: string;
  teacher?: { user_id: string; name?: string; full_name?: string };
  [key: string]: any;
};

const Groups: React.FC = () => {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<GroupType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<GroupType | null>(null);
  const [showAttendance, setShowAttendance] = useState(false); 
  const [attendanceItem, setAttendanceItem] = useState<GroupType | null>(null); 
  const [attendanceModalKey, setAttendanceModalKey] = useState(0); 
  const [filter, setFilter] = useState("");

  const fetchGroups = async () => {
    setLoading(true);
    try {
      let url = "/groups";
      // Agar teacher roli bo'lsa, faqat o'zining guruhlari uchun query qo'shamiz
      if (user?.role === "teacher" && user?.user_id) {
        url += `?teacher_id=${user.user_id}`;
      }
      const res = await instance.get(url);
      let data = res.data.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setGroups(data);
    } catch (err: any) {
      setError("Guruhlarni olishda xatolik");
      setToast({ message: err.message || "Guruhlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(filter.toLowerCase()));

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Guruhni o'chirishni tasdiqlaysizmi?",
      okText: "Ha, o'chirish",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk: async () => {
        setLoading(true);
        try {
          await instance.delete(`/groups/${id}`);
          setToast({ message: "Guruh o'chirildi!", type: 'success' });
          fetchGroups();
        } catch (err: any) {
          setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
        } finally {
          setLoading(false);
        }
      }
    });
  };
  const handleEdit = (group: GroupType) => {
    setEditItem(group);
    setShowEdit(true);
  };
  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: GroupType) => (
        <a style={{ cursor: 'pointer' }} onClick={() => { setDetailItem(record); setShowDetail(true); }}>{record.name}</a>
      )
    },
    { title: "Tavsif", dataIndex: "description", key: "description" },
    { title: "Status", key: "status", render: (_: any, record: GroupType) => record.status === 'ACTIVE' ? 'Faol' : 'Nofaol' },
    { title: "O'qituvchi", key: "teacher", render: (_: any, record: GroupType) => record.teacher?.full_name || record.teacher?.name || '-' },
    { title: "Boshlanish sanasi", key: "start_date", render: (_: any, record: GroupType) => record.start_date || '-' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: GroupType) => (
        <span className="group-table-actions">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.group_id)} />
          <Button
  type="link"
  icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
  onClick={() => {
    setAttendanceItem(record);
    setShowAttendance(true);
    setAttendanceModalKey(prev => prev + 1);
  }}
  title="Davomat"
/>

        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Guruhlar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="group-header-add-btn">
            <ButtonComponent showAdd={true} onAddClick={() => setShowAdd(true)} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Input
          placeholder="🔍 Guruh nomi bo'yicha qidirish..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spin size="large" /></div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredGroups}
          pagination={false}
          rowKey={record => String(record.group_id)}
          className="bg-white rounded shadow"
        />
      )}
      <EditGroupModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onGroupEdited={fetchGroups}
        group={editItem}
      />
      <AddGroupModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onGroupAdded={fetchGroups}
      />
      <GroupDetailModal
        groupId={detailItem?.group_id}
        isOpen={showDetail}
        onClose={() => { setShowDetail(false); setDetailItem(null); }}
      />
      <AddAttendanceModal
        key={attendanceModalKey}
        open={showAttendance}
        onClose={() => { setShowAttendance(false); setAttendanceItem(null); }}
        onSuccess={fetchGroups}
        groups={attendanceItem ? [attendanceItem] : []}
      />
    </div>
  );
};

export default Groups;
