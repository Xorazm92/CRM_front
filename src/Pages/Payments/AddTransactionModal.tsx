import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import instance from "../../api/axios";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ user_id: string; name: string }[]>([]);

  useEffect(() => {
    if (open) {
      instance.get("/users?limit=1000").then(res => {
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setUsers(arr.map((u: any) => ({ user_id: u.user_id || u._id, name: `${u.lastname} ${u.name}` })));
      });
    }
  }, [open]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      // Backendga aynan modelga mos payload yuboriladi
      const payload = {
        amount: Number(values.amount),
        type: values.type, // PAYMENT, REFUND, SALARY, OTHER
        status: values.status, // PENDING, SUCCESS, FAILED
        source_id: values.source_id, // user_id string
        target_id: values.target_id, // user_id string
        reason: values.reason || undefined // ixtiyoriy
      };
      // Use RESTful NestJS endpoint for transactions
await instance.post("/transactions", payload);
      message.success("Pul o'tkazmasi muvaffaqiyatli qo'shildi!");
      onClose();
      form.resetFields();
      onSuccess && onSuccess();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "O'tkazmani qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Pul o'tkazmasi qo'shish" destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="source_id" label="Kimdan (source)" rules={[{ required: true, message: "Kimdan majburiy" }]}> 
          <Select showSearch optionFilterProp="children" placeholder="Foydalanuvchi tanlang">
            {users.map(u => (
              <Select.Option key={u.user_id} value={u.user_id}>{u.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="target_id" label="Kimga (target)" rules={[{ required: true, message: "Kimga majburiy" }]}> 
          <Select showSearch optionFilterProp="children" placeholder="Foydalanuvchi tanlang">
            {users.map(u => (
              <Select.Option key={u.user_id} value={u.user_id}>{u.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="amount" label="Miqdor" rules={[{ required: true, message: "Miqdor majburiy" }]}> 
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="type" label="Turi" rules={[{ required: true, message: "Turi majburiy" }]}> 
          <Select>
            <Select.Option value="PAYMENT">To'lov</Select.Option>
            <Select.Option value="REFUND">Qaytarish</Select.Option>
            <Select.Option value="SALARY">Oylik</Select.Option>
            <Select.Option value="OTHER">Boshqa</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy" }]}> 
          <Select>
            <Select.Option value="PENDING">Kutilmoqda</Select.Option>
            <Select.Option value="SUCCESS">Muvaffaqiyatli</Select.Option>
            <Select.Option value="FAILED">Bekor qilingan</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="reason" label="Izoh"> 
          <Input.TextArea rows={2} placeholder="Izoh (ixtiyoriy)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTransactionModal;
