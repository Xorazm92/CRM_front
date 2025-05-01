import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Table, Button, Modal, Form, Input, Select, message, Badge, Row, Col } from "antd";

interface AdminType {
  user_id: string;
  username: string;
  name: string;
  lastname: string;
  role: string;
  status: string;
}

const AdminsPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const fetchAdmins = () => {
    setLoading(true);
    instance.get("/users?role=ADMIN")
      .then(res => setAdmins(res.data.data || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await instance.post("/users", { ...values, role: "ADMIN" });
      message.success("Admin muvaffaqiyatli yaratildi");
      setModalOpen(false);
      form.resetFields();
      fetchAdmins();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "green",
    BLOCKED: "red",
    INACTIVE: "orange"
  };

  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.lastname.toLowerCase().includes(search.toLowerCase()) ||
    a.username.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "F.I.Sh.", render: (r: AdminType) => `${r.name} ${r.lastname}` },
    { title: "Username", dataIndex: "username" },
    { title: "Status", dataIndex: "status", render: (status: string) => <Badge color={statusColors[status] || 'blue'} text={status} /> },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Row justify="space-between" align="middle" gutter={16} className="mb-4">
        <Col><h2 className="text-xl font-semibold">Adminlar</h2></Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Input
            placeholder="Qidiruv: ism, familiya, username"
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ marginBottom: 8 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Yangi admin yaratish
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={filteredAdmins}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }}
        locale={{ emptyText: loading ? 'Yuklanmoqda...' : 'Adminlar topilmadi' }}
      />
      <Modal
        title="Yangi admin yaratish"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism kiriting" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya kiriting" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username kiriting" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol kiriting" }, { min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: "Email noto'g'ri kiritilgan" }]}> <Input /> </Form.Item>
          <Form.Item name="phone_number" label="Telefon" rules={[{ pattern: /^\+?\d{9,15}$/, message: "Telefon raqami noto'g'ri!" }]}> <Input placeholder="Masalan, +998901234567" /> </Form.Item>
          <Form.Item>
            <Button onClick={() => { setModalOpen(false); form.resetFields(); }} style={{ marginRight: 8 }}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Yaratish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminsPage;
