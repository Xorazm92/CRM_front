import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Table, Input, Spin, Tag, message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import AddAssignmentModal from "./AddAssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";
import AssignmentSubmissionsModal from "./AssignmentSubmissionsModal";
import SubmitAssignmentModal from "./SubmitAssignmentModal";
import ViewAssignmentModal from "./ViewAssignmentModal";
import Toast from "../../components/Toast";
import ButtonComponent from "../../components/Button/Button";
import dayjs from "dayjs";
import "./Assignments.css";
import { showDeadlineNotification } from "../../utils/notification";

interface AssignmentType {
  assignment_id: string | number;
  title: string;
  description?: string;
  due_date: string;
  group: { name: string };
  status: string;
  file_path?: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<AssignmentType | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissionsItem, setSubmissionsItem] = useState<AssignmentType | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitItem, setSubmitItem] = useState<AssignmentType | null>(null);
  const [filter, setFilter] = useState("");
  const [showView, setShowView] = useState(false);
  const [viewItem, setViewItem] = useState<AssignmentType | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/assignments");
      let data = res.data.data;
      if (!Array.isArray(data)) data = [];
      setAssignments(data);
    } catch (err: any) {
      setError("Topshiriqlarni olishda xatolik");
      setToast({ message: err.message || "Topshiriqlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    assignments.forEach(a => {
      if (!a.due_date) return;
      const diff = dayjs(a.due_date).diff(dayjs(), "hour");
      if (diff > 0 && diff <= 24) {
        if (!sessionStorage.getItem(`deadline_notify_${a.assignment_id}`)) {
          showDeadlineNotification(a.title, dayjs(a.due_date).format("YYYY-MM-DD HH:mm"));
          sessionStorage.setItem(`deadline_notify_${a.assignment_id}`, "1");
        }
      }
    });
  }, [assignments]);

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(filter.toLowerCase()) ||
    (a.group?.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/assignments/${id}`);
      setToast({ message: "Topshiriq o'chirildi!", type: 'success' });
      fetchAssignments();
    } catch (err: any) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Sarlavha', dataIndex: 'title', key: 'title', render: (_: any, record: AssignmentType) => (
      <a
        style={{ cursor: 'pointer', fontWeight: 500 }}
        onClick={() => { setViewItem(record); setShowView(true); }}
      >
        {record.title}
      </a>
    ) },
    { title: 'Guruh', key: 'group', render: (_: any, record: AssignmentType) => record.group?.name || '-' },
    { title: 'Deadline', key: 'due_date', render: (_: any, record: AssignmentType) => {
      const isPast = dayjs(record.due_date).isBefore(dayjs());
      return <Tag color={isPast ? "red" : "blue"}>{dayjs(record.due_date).format("YYYY-MM-DD HH:mm")}</Tag>;
    } },
    { title: 'Status', key: 'status', render: (_: any, record: AssignmentType) => (
      <Tag color={record.status === 'ACTIVE' ? 'green' : 'red'}>{record.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</Tag>
    ) },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: AssignmentType) => (
        <span className="assignment-table-actions">
          <ButtonComponent
            showView={true}
            showEdit={true}
            showDelete={true}
            onViewClick={() => { setViewItem(record); setShowView(true); }}
            onEditClick={() => { setEditItem(record); setShowEdit(true); }}
            onDeleteClick={() => handleDelete(record.assignment_id)}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="assignment-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Topshiriqlar jadvali</h1>
        <ButtonComponent showAdd={true} onAddClick={() => setShowAdd(true)} />
      </div>
      <div className="mb-4">
        <Input
          placeholder="🔍 Sarlavha yoki guruh bo‘yicha qidirish..."
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
          dataSource={filteredAssignments}
          pagination={{ pageSize: 10 }}
          rowKey={record => String(record.assignment_id)}
          className="bg-white rounded shadow"
        />
      )}
      <AddAssignmentModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchAssignments}
      />
      <EditAssignmentModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchAssignments}
        assignment={editItem}
      />
      <AssignmentSubmissionsModal
        open={showSubmissions}
        onClose={() => { setShowSubmissions(false); setSubmissionsItem(null); }}
        assignment={submissionsItem}
      />
      <SubmitAssignmentModal
        open={showSubmit}
        onClose={() => { setShowSubmit(false); setSubmitItem(null); }}
        assignment={submitItem}
        onSuccess={fetchAssignments}
      />
      <ViewAssignmentModal
        open={showView}
        onClose={() => { setShowView(false); setViewItem(null); }}
        assignment={viewItem}
      />
    </div>
  );
};

export default Assignments;
