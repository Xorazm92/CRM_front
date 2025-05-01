// Converted from AddStudentPaymentModal.jsx to AddStudentPaymentModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { createStudentPayment } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";
import { getUsers } from "../../api/users";

interface AddStudentPaymentModalProps {
  studentId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddStudentPaymentForm {
  amount: number | string;
  type: string; // Backend expects 'type', not 'payment_type'
  description?: string;
  student_id?: string;
}

const AddStudentPaymentModal: React.FC<AddStudentPaymentModalProps> = ({ studentId, open, onClose, onSuccess }) => {
  const [form] = Form.useForm<AddStudentPaymentForm>();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getUsers({ role: "STUDENT", limit: 1000 })
        .then(res => setStudents(res.data || []))
        .catch(() => setStudents([]));
    }
  }, [open]);

  const handleFinish = async (values: AddStudentPaymentForm) => {
    setLoading(true);
    try {
      const payload = {
        student_id: values.student_id || getEntityId(studentId) || studentId,
        amount: Number(values.amount),
        type: values.type,
        description: values.description || undefined
      };
      console.log('Add payment payload:', payload);
      await createStudentPayment(payload);
      message.success("To‘lov muvaffaqiyatli qo'shildi");
      onClose();
      form.resetFields();
    } catch (err) {
      console.error('Add payment error:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      message.error(errorMsg || "To‘lovni amalga oshirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const isStudentFixed = !!studentId;

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="To‘lov qilish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* Student tanlash */}
          <Form.Item
            name="student_id"
            label="Talaba"
            rules={[{ required: true, message: 'Talabani tanlang' }]}
            initialValue={studentId || undefined}
          >
            <Select
              showSearch
              placeholder="Talabani tanlang"
              optionFilterProp="children"
              disabled={isStudentFixed || loading}
              filterOption={(input, option) =>
                typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={students
                .filter(s => !!s.user_id)
                .map(s => ({ value: s.user_id, label: `${s.lastname} ${s.name} ${s.middlename || ""}` }))}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="To‘lov summasi"
            rules={[
              { required: true, message: "Summani kiriting!" },
              { type: "number", min: 1, transform: v => Number(v), message: "Summani to‘g‘ri kiriting!" }
            ]}
          >
            <Input type="number" disabled={loading} />
          </Form.Item>
          <Form.Item
            name="type"
            label="To‘lov turi"
            initialValue="MONTHLY"
            rules={[{ required: true, message: "To‘lov turini tanlang!" }]}
          >
            <Select disabled={loading} options={[
              { value: "MONTHLY", label: "Oylik" },
              { value: "COURSE", label: "Kurs uchun" },
              { value: "OTHER", label: "Boshqa" }
            ]} />
          </Form.Item>
          <Form.Item name="description" label="Izoh">
            <Input disabled={loading} />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>To‘lov qilish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddStudentPaymentModal;
