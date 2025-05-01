// Converted from EditCourseModal.jsx to EditCourseModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Spin, message } from "antd";
import instance from "../../api/axios";
import "./EditCourseModal.css";

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  course: any;
}

interface EditCourseForm {
  name: string;
  description: string;
  duration: number;
  status: string;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ open, onClose, onSuccess, course }) => {
  const [form] = Form.useForm<EditCourseForm>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (course && open) {
      form.setFieldsValue({
        name: course.name || '',
        description: course.description || '',
        duration: course.duration || '',
        status: course.status || 'ACTIVE',
      });
    }
    if (!open) form.resetFields();
  }, [course, open, form]);

  const handleFinish = async (values: EditCourseForm) => {
    setLoading(true);
    try {
      const id = course?.course_id || course?.id;
      if (!id) throw new Error("Kurs ID aniqlanmadi");
      const payload = {
        ...values,
        duration: Number(values.duration),
      };
      await instance.patch(`/course/${id}`, payload);
      message.success("Kurs muvaffaqiyatli tahrirlandi!");
      onSuccess && onSuccess();
      setTimeout(() => {
        form.resetFields();
        onClose();
      }, 800);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || err.message || "Tahrirlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Kursni tahrirlash">
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Kurs nomi" rules={[{ required: true, message: "Kurs nomi majburiy!" }]}>
            <Input placeholder="Kurs nomi" disabled={loading} />
          </Form.Item>
          <Form.Item name="description" label="Izoh" rules={[{ required: true, message: "Izoh majburiy!" }]}> 
            <Input placeholder="Izoh" disabled={loading} /> 
          </Form.Item>
          <Form.Item name="duration" label="Davomiyligi (oy)" rules={[{ required: true, message: "Davomiylik majburiy!" }]}> 
            <Input type="number" min={1} placeholder="Davomiyligi (oy)" disabled={loading} /> 
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> 
            <Select disabled={loading}> 
              <Select.Option value="ACTIVE">Faol</Select.Option> 
              <Select.Option value="INACTIVE">Nofaol</Select.Option> 
            </Select> 
          </Form.Item>
          <Form.Item>
            <div className="edit-course-modal-footer">
              <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditCourseModal;
