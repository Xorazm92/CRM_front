import React, { useEffect, useState } from "react";
import { Table, Select, DatePicker, Input, Space, message, Tag, Popconfirm, Spin } from "antd";
import instance from "../../api/axios";
import AddAttendanceModal from "./AddAttendanceModal";
import EditAttendanceModal from "./EditAttendanceModal";
import Toast from "../../components/Toast";
import Button from '../../components/Button/Button';
import "./attendance-page.css";

const { Option } = Select;

const statusColors: Record<string, string> = {
  PRESENT: "green",
  ABSENT: "red",
  LATE: "orange",
  EXCUSED: "blue",
};

const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    group: undefined,
    lesson: undefined,
    student: undefined,
    date: undefined,
    status: undefined,
  });
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; record: any | null }>({ open: false, record: null });
  const [groups, setGroups] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    instance.get("/groups").then(res => setGroups(res.data.data || []));
    instance.get("/lesson").then(res => setLessons(res.data.data || []));
    instance.get("/users", { params: { role: "STUDENT" } }).then(res => setStudents(res.data.data || []));
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/attendance", { params: filters });
      setAttendance(res.data.data || []);
    } catch (err: any) {
      setError("Davomatlarni olishda xatolik");
      setToast({ message: err.message || "Davomatlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getGroupName = (lesson: any) => lesson && lesson.group && lesson.group.name ? lesson.group.name : "-";
  const getLessonTopic = (lesson: any) => lesson && lesson.topic ? lesson.topic : "-";
  const getStudentName = (student: any) => student ? (student.name + (student.lastname ? " " + student.lastname : "")) : "-";

  const handleDelete = async (attendance_id: string) => {
    if (!window.confirm("Haqiqatan ham o‘chirilsinmi?")) return;
    setLoading(true);
    try {
      await instance.delete(`/attendance/${attendance_id}`);
      setToast({ message: "Davomat o‘chirildi!", type: 'success' });
      fetchAttendance();
    } catch (err: any) {
      setToast({ message: err.message || "O‘chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    {
      title: "Sana",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) => val ? new Date(val).toLocaleDateString() : "-",
    },
    {
      title: "Guruh",
      dataIndex: ["lesson", "group", "name"],
      key: "group",
      render: (_: any, rec: any) => getGroupName(rec.lesson),
    },
    {
      title: "Dars",
      dataIndex: ["lesson", "topic"],
      key: "lesson",
      render: (_: any, rec: any) => getLessonTopic(rec.lesson),
    },
    {
      title: "Talaba",
      dataIndex: ["student", "name"],
      key: "student",
      render: (_: any, rec: any) => getStudentName(rec.student),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>
          {status === "PRESENT" && "Kelgan"}
          {status === "ABSENT" && "Kelmagan"}
          {status === "LATE" && "Kechikkan"}
          {status === "EXCUSED" && "Sababli"}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, rec: any) => (
        <span className="course-table-actions">
          <Button type="link" onClick={() => setEditModal({ open: true, record: rec })}>Tahrirlash</Button>
          <Popconfirm title="O‘chirishni tasdiqlaysizmi?" onConfirm={() => handleDelete(rec.attendance_id)}>
            <Button type="link" danger>O‘chirish</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Davomat jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            showAdd={true}
            onAddClick={() => setAddModal(true)}
          />
        </div>
      </div>
      <div className="attendance-filters" style={{ marginBottom: 16 }}>
        <Select
          placeholder="Guruh tanlang"
          allowClear
          style={{ width: 150 }}
          onChange={val => handleFilterChange("group", val)}
          value={filters.group}
        >
          {groups.map(g => (
            <Option key={g.group_id} value={g.group_id}>{g.name}</Option>
          ))}
        </Select>
        <Select
          placeholder="Dars tanlang"
          allowClear
          style={{ width: 180 }}
          onChange={val => handleFilterChange("lesson", val)}
          value={filters.lesson}
        >
          {lessons.map(l => (
            <Option key={l.lesson_id} value={l.lesson_id}>{l.topic}</Option>
          ))}
        </Select>
        <Select
          placeholder="Talaba tanlang"
          allowClear
          style={{ width: 180 }}
          onChange={val => handleFilterChange("student", val)}
          value={filters.student}
          showSearch
          optionFilterProp="children"
        >
          {students.map(s => (
            <Option key={s.user_id} value={s.user_id}>{s.name} {s.lastname}</Option>
          ))}
        </Select>
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 120 }}
          onChange={val => handleFilterChange("status", val)}
          value={filters.status}
        >
          <Option value="PRESENT">Kelgan</Option>
          <Option value="ABSENT">Kelmagan</Option>
          <Option value="LATE">Kechikkan</Option>
          <Option value="EXCUSED">Sababli</Option>
        </Select>
        <DatePicker
          placeholder="Sana"
          style={{ width: 140 }}
          onChange={date => handleFilterChange("date", date ? date.format("YYYY-MM-DD") : undefined)}
          value={filters.date ? (typeof filters.date === "string" ? filters.date : undefined) : undefined}
        />
        <Input.Search
          placeholder="Talaba ismi"
          style={{ width: 180 }}
          onSearch={val => handleFilterChange("student", val)}
          allowClear
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spin size="large" /></div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <div className="attendance-table">
          <Table
            rowKey="attendance_id"
            dataSource={attendance}
            columns={columns}
            bordered
            size="middle"
            scroll={{ x: true }}
            pagination={false}
          />
        </div>
      )}
      <AddAttendanceModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSuccess={fetchAttendance}
        groups={groups}
        lessons={lessons}
        students={students}
      />
      <EditAttendanceModal
        open={editModal.open}
        record={editModal.record}
        onClose={() => setEditModal({ open: false, record: null })}
        onSuccess={fetchAttendance}
        groups={groups}
        lessons={lessons}
        students={students}
      />
    </div>
  );
};

export default AttendancePage;
