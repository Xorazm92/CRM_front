import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

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

  const columns = [
    { title: "ID", dataIndex: "user_id", key: "user_id" },
    { title: "F.I.Sh.", render: (r: AdminType) => `${r.name} ${r.lastname}` },
    { title: "Username", dataIndex: "username" },
    { title: "Status", dataIndex: "status" },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Adminlar</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Yangi admin yaratish
        </Button>
      </div>
      <Table
        dataSource={admins}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={false}
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
          <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol kiriting" }]}>
            <Input.Password />
          </Form.Item>
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
