import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Table, Button, Select, Input, message, Popconfirm } from "antd";

interface UserType {
  user_id: string;
  username: string;
  name: string;
  lastname: string;
  role: string;
  status: string;
}

const roleOptions = [
  { label: "Superadmin", value: "SUPERADMIN" },
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
];

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    instance.get("/users", { params: { search } })
      .then(res => setUsers(res.data.data || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search]);

  const handleRoleChange = async (user_id: string, role: string) => {
    try {
      await instance.patch(`/users/${user_id}`, { role });
      message.success("Rol muvaffaqiyatli o‘zgartirildi");
      fetchUsers();
    } catch {
      message.error("Rolni o‘zgartirishda xatolik");
    }
  };

  const handleDelete = async (user_id: string) => {
    try {
      await instance.delete(`/users/${user_id}`);
      message.success("Foydalanuvchi o‘chirildi");
      fetchUsers();
    } catch {
      message.error("O‘chirishda xatolik");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "user_id", key: "user_id" },
    { title: "F.I.Sh.", render: (r: UserType) => `${r.name} ${r.lastname}` },
    { title: "Username", dataIndex: "username" },
    { title: "Rol", dataIndex: "role", render: (role: string, record: UserType) => (
      <Select
        value={role}
        options={roleOptions}
        style={{ minWidth: 120 }}
        onChange={v => handleRoleChange(record.user_id, v)}
        disabled={record.role === "SUPERADMIN"}
      />
    ) },
    { title: "Status", dataIndex: "status" },
    { title: "Amallar", render: (_: any, record: UserType) => (
      <Popconfirm
        title="Foydalanuvchini o‘chirasizmi?"
        onConfirm={() => handleDelete(record.user_id)}
        okText="Ha"
        cancelText="Yo‘q"
        disabled={record.role === "SUPERADMIN"}
      >
        <Button danger size="small" disabled={record.role === "SUPERADMIN"}>O‘chirish</Button>
      </Popconfirm>
    ) },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Barcha foydalanuvchilar</h2>
        <Input.Search
          placeholder="Foydalanuvchi qidirish..."
          style={{ width: 250 }}
          allowClear
          onSearch={v => setSearch(v)}
        />
      </div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};

export default UsersManagement;
