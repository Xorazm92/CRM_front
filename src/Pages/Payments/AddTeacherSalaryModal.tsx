// Converted from AddTeacherSalaryModal.jsx to AddTeacherSalaryModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Spin, Select } from "antd";
import { createTeacherSalary } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";
import { fetchTeachers } from "../../api/teachers";

interface AddTeacherSalaryModalProps {
  teacherId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

import dayjs from "dayjs";
import { DatePicker } from "antd";

interface AddTeacherSalaryForm {
  amount: number | string;
  description?: string;
  status?: string;
  teacher_id?: string;
  date?: any;
}

const AddTeacherSalaryModal: React.FC<AddTeacherSalaryModalProps> = ({ teacherId, open, onClose, onSuccess }) => {
  const [form] = Form.useForm<AddTeacherSalaryForm & { teacher_id?: string }>();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchTeachers()
        .then(res => setTeachers(Array.isArray(res) ? res : []))
        .catch(() => setTeachers([]));
    }
  }, [open]);

  const handleFinish = async (values: AddTeacherSalaryForm & { teacher_id?: string }) => {
    setLoading(true);
    try {
      const payload = {
        teacher_id: values.teacher_id || getEntityId(teacherId) || teacherId,
        amount: Number(values.amount),
        description: values.description || undefined,
        status: values.status || "PENDING",
        type: "SALARY",
        date: values.date ? values.date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
      };
      console.log('Add salary payload:', payload);
      await createTeacherSalary(payload);
      message.success("Oylik muvaffaqiyatli hisoblandi!");
      onClose();
      form.resetFields();
      onSuccess && onSuccess();
    } catch (err: any) {
      console.error('Add salary error:', err);
      message.error(err.message || "Oylikni amalga oshirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Oylik hisoblash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: "PENDING", date: undefined }}>
          {/* O'qituvchini tanlash */}
          <Form.Item
            name="teacher_id"
            label="O'qituvchi"
            rules={[{ required: true, message: "O'qituvchini tanlang!" }]}
            initialValue={teacherId || undefined}
          >
            {loading ? (
              <Spin size="small" />
            ) : (
              <Select
                showSearch
                placeholder="O'qituvchini tanlang"
                optionFilterProp="children"
                disabled={loading}
                filterOption={(input, option) =>
                  typeof option?.children === 'string' && option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {Array.isArray(teachers) && teachers.length > 0
                  ? teachers
                      .filter(t => !!(t.user_id || t.id || t._id))
                      .map(t => (
                        <Select.Option
                          key={t.user_id || t.id || t._id}
                          value={t.user_id || t.id || t._id}
                        >
                          {(t.lastname || t.last_name || t.surname || "") + " " + (t.name || t.first_name || "")}
                        </Select.Option>
                      ))
                  : (
                    <Select.Option disabled key="no-teacher" value="">
                      O'qituvchilar topilmadi
                    </Select.Option>
                  )}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            name="date"
            label="Sana"
            rules={[{ required: true, message: "Sanani tanlang!" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" disabled={loading} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Oylik summasi"
            rules={[
              { required: true, message: "Summani kiriting!" },
              { type: "number", min: 1, transform: v => Number(v), message: "Summani to‘g‘ri kiriting!" }
            ]}
          >
            <Input type="number" disabled={loading} />
          </Form.Item>
          <Form.Item name="description" label="Izoh">
            <Input disabled={loading} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select disabled={loading}>
              <Select.Option value="PENDING">Kutilmoqda</Select.Option>
              <Select.Option value="COMPLETED">To‘langan</Select.Option>
              <Select.Option value="CANCELLED">Bekor qilingan</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Oylik hisoblash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddTeacherSalaryModal;
