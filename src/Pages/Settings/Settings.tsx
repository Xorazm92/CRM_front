import React, { useState } from "react";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import { Form, Input, Button, Spin } from "antd";

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });

  const handleSubmit = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (!values.oldPassword || !values.newPassword || !values.confirmPassword) {
      setToast({ message: "Barcha maydonlar to‘ldirilishi shart", type: 'error' });
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setToast({ message: "Yangi parollar mos emas", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/auth/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      setToast({ message: "Parol muvaffaqiyatli o‘zgartirildi!", type: 'success' });
      form.resetFields();
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || err.message || "Xatolik yuz berdi", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Sozlamalar</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="flex flex-col gap-3"
      >
        <Form.Item name="oldPassword" label="Joriy parol" rules={[{ required: true, message: 'Joriy parolni kiriting' }]}> 
          <Input.Password disabled={loading} placeholder="Joriy parol" />
        </Form.Item>
        <Form.Item name="newPassword" label="Yangi parol" rules={[{ required: true, message: 'Yangi parolni kiriting' }]}> 
          <Input.Password disabled={loading} placeholder="Yangi parol" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Yangi parolni tasdiqlang" rules={[{ required: true, message: 'Yangi parolni tasdiqlang' }]}> 
          <Input.Password disabled={loading} placeholder="Yangi parolni tasdiqlang" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className="w-full">Parolni o‘zgartirish</Button>
      </Form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default Settings;
