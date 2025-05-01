import React, { useEffect, useState } from "react";
import { Table, Select, DatePicker, Input, Space, Tag, Popconfirm, Spin } from "antd";
import ButtonComponent from '../../components/Button/Button';
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import instance from "../../api/axios";
import AddAttendanceModal from "./AddAttendanceModal";
import EditAttendanceModal from "./EditAttendanceModal";
import Toast from "../../components/Toast";
import { useAuthStore } from '../../store/useAuthStore';
import "./attendance-page.css";

const { Option } = Select;

const statusColors = {
  PRESENT: "green",
  ABSENT: "red",
  LATE: "orange",
  EXCUSED: "blue",
};

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    group: undefined,
    lesson: undefined,
    student: undefined,
    date: undefined,
    status: undefined,
  });
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [groups, setGroups] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const user = useAuthStore(state => state.user);

  // Fetch initial data
  useEffect(() => {
    fetchGroups();
    fetchStudents();
    fetchAssignments();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await instance.get('/groups');
      setGroups(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setGroups([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await instance.get("/users", { params: { role: "STUDENT" } });
      setStudents(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setStudents([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await instance.get('/assignments');
      setAssignments(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setAssignments([]);
    }
  };

  // Extract lessons when group filter changes
  useEffect(() => {
    if (filters.group) {
      const filtered = extractLessonsFromAssignments(assignments, filters.group);
      setLessons(filtered);
    } else {
      setLessons([]);
    }
  }, [filters.group, assignments]);

  // Extract unique lessons from assignments for selected group
  const extractLessonsFromAssignments = (assignments, groupId) => {
    const lessons = [];
    const lessonMap = new Map();
    
    assignments.forEach(a => {
      if (a.group_id === groupId && a.lesson) {
        if (!lessonMap.has(a.lesson.lesson_id)) {
          lessonMap.set(a.lesson.lesson_id, true);
          lessons.push({ lesson_id: a.lesson.lesson_id, topic: a.lesson.topic });
        }
      }
    });
    
    return lessons;
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    
    try {
      let params = { ...filters };
      
      // Correct parameter names for backend
      if (params.student) {
        params.student_id = params.student;
        delete params.student;
      }
      if (params.lesson) {
        params.lesson_id = params.lesson;
        delete params.lesson;
      }
      if (params.group) {
        params.group_id = params.group;
        delete params.group;
      }
      
      // Add pagination params
      params.page = pagination.current;
      params.limit = pagination.pageSize;
      
      // Add role-specific filters
      if (user?.role === 'teacher' && user?.user_id) {
        params.teacher_id = user.user_id;
      } else if (user?.role === 'student' && user?.user_id) {
        params.student_id = user.user_id;
      }
      
      const res = await instance.get("/attendance", { params });
      
      // Handle pagination data if available in response
      if (res.data && res.data.meta) {
        setPagination({
          ...pagination,
          total: res.data.meta.total || res.data.data.length,
        });
      }
      
      setAttendance(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setError("Davomatlarni olishda xatolik");
      setToast({ message: err.message || "Davomatlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchAttendance();
  }, [filters, pagination.current, pagination.pageSize]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
  };

  const handleDelete = async (attendance_id) => {
    setLoading(true);
    try {
      await instance.delete(`/attendance/${attendance_id}`);
      setToast({ message: "Davomat o'chirildi!", type: 'success' });
      fetchAttendance();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getGroupName = (lesson) => lesson && lesson.group && lesson.group.name ? lesson.group.name : "-";
  const getLessonTopic = (lesson) => lesson && lesson.topic ? lesson.topic : "-";
  const getStudentName = (student) => student ? (student.name + (student.lastname ? " " + student.lastname : "")) : "-";

  const columns = [
    { title: '#', key: 'index', render: (_, __, idx) => (pagination.current - 1) * pagination.pageSize + idx + 1 },
    {
      title: "Sana",
      dataIndex: "created_at",
      key: "created_at",
      render: (val) => val ? new Date(val).toLocaleDateString() : "-",
    },
    {
      title: "Guruh",
      dataIndex: ["lesson", "group", "name"],
      key: "group",
      render: (_, rec) => getGroupName(rec.lesson),
    },
    {
      title: "Dars",
      dataIndex: ["lesson", "topic"],
      key: "lesson",
      render: (_, rec) => getLessonTopic(rec.lesson),
    },
    {
      title: "Talaba",
      dataIndex: ["student", "name"],
      key: "student",
      render: (_, rec) => getStudentName(rec.student),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
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
      render: (_, rec) => (
        <Space size="middle">
          <EditOutlined 
            className="text-blue-500 cursor-pointer text-lg" 
            onClick={() => setEditModal({ open: true, record: rec })} 
          />
          <Popconfirm 
            title="O'chirishni tasdiqlaysizmi?" 
            onConfirm={() => handleDelete(rec.attendance_id)}
          >
            <DeleteOutlined className="text-red-500 cursor-pointer text-lg" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddSuccess = () => {
    // Reset filters and fetch data
    setFilters({
      group: undefined,
      lesson: undefined,
      student: undefined,
      date: undefined,
      status: undefined,
    });
    setPagination({ ...pagination, current: 1 });
    setTimeout(() => setAddModal(false), 0);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />
      
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Davomat jadvali</h1>
        <ButtonComponent showAdd={true} onAddClick={() => setAddModal(true)} />
      </div>
      
      <div className="attendance-filters" style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Select
          allowClear
          placeholder="Guruh"
          style={{ width: 180, minWidth: 120 }}
          options={groups.map(g => ({ label: g.name, value: g.group_id || g._id || g.id }))}
          value={filters.group}
          onChange={val => handleFilterChange("group", val)}
        />
        <Select
          allowClear
          placeholder="Dars"
          style={{ width: 180, minWidth: 120 }}
          options={lessons.map(l => ({ label: l.topic, value: l.lesson_id }))}
          value={filters.lesson}
          onChange={val => handleFilterChange("lesson", val)}
          disabled={!filters.group}
        />
        <Select
          allowClear
          showSearch
          placeholder="Talaba"
          style={{ width: 180, minWidth: 120 }}
          options={students.map(s => ({ label: s.name + (s.lastname ? ' ' + s.lastname : ''), value: s.user_id || s._id || s.id }))}
          value={filters.student}
          onChange={val => handleFilterChange("student", val)}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
        <Select
          allowClear
          placeholder="Status"
          style={{ width: 140, minWidth: 100 }}
          options={[
            { label: 'Kelgan', value: 'PRESENT' },
            { label: 'Kelmagan', value: 'ABSENT' },
            { label: 'Kechikkan', value: 'LATE' },
          ]}
          value={filters.status}
          onChange={val => handleFilterChange("status", val)}
        />
        <DatePicker
          allowClear
          placeholder="Sana"
          style={{ width: 140, minWidth: 100 }}
          onChange={date => handleFilterChange("date", date ? date.format("YYYY-MM-DD") : undefined)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spin size="large" /></div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <div className="attendance-table">
          <Table
            rowKey={record => record.attendance_id || record.id}
            dataSource={attendance}
            columns={columns}
            bordered
            size="middle"
            scroll={{ x: true }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Jami: ${total}`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
          />
          <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }} />
        </div>
      )}
      
      <AddAttendanceModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSuccess={handleAddSuccess}
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