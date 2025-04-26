import React from "react";
import { Modal, Form, Input, Select, Button, DatePicker, Spin, message } from "antd";
import instance from "../../api/axios";
import dayjs from "dayjs";
import "./Groups.css";

interface Teacher {
  user_id: string;
  full_name?: string;
  name?: string;
  [key: string]: any;
}

interface Course {
  course_id: string;
  name: string;
  [key: string]: any;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded?: () => void;
}

interface AddGroupForm {
  name: string;
  description: string;
  course_id: string;
  teacher_id: string;
  status: string;
  start_date?: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onGroupAdded }) => {
  const [form] = Form.useForm<AddGroupForm>();
  const [loading, setLoading] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [isOpen, form]);

  React.useEffect(() => {
    if (isOpen) {
      instance.get("/course").then(res => {
        setCourses(Array.isArray(res.data.data) ? res.data.data : []);
      });
      instance.get("/users?role=TEACHER").then(res => {
        console.log("TEACHER users response:", res.data);
        setTeachers(Array.isArray(res.data.data) ? res.data.data : []);
      }).catch(err => {
        console.log("TEACHER fetch error:", err);
        setTeachers([]);
      });
    }
  }, [isOpen]);

  const handleFinish = async (values: AddGroupForm) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        start_date: values.start_date ? dayjs(values.start_date).format("YYYY-MM-DD") : undefined,
      };
      await instance.post("/groups", payload);
      message.success("Guruh qo'shildi!");
      form.resetFields();
      onGroupAdded && onGroupAdded();
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruh qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Guruh nomi majburiy!" }]}> 
            <Input placeholder="Guruh nomi" disabled={loading} />
          </Form.Item>
          <Form.Item name="description" label="Izoh" rules={[{ required: true, message: "Izoh majburiy!" }]}> 
            <Input placeholder="Izoh" disabled={loading} />
          </Form.Item>
          <Form.Item name="course_id" label="Kurs" rules={[{ required: true, message: "Kurs majburiy!" }]}> 
            <Select placeholder="Kursni tanlang" disabled={loading} showSearch optionFilterProp="children">
              {courses.map(course => (
                <Select.Option key={course.course_id} value={course.course_id}>{course.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="teacher_id" label="O'qituvchi" rules={[{ required: true, message: "O'qituvchi majburiy!" }]}> 
            <Select placeholder="O'qituvchini tanlang" disabled={loading} showSearch optionFilterProp="children">
              {teachers.map(teacher => (
                <Select.Option key={teacher.user_id} value={teacher.user_id}>{teacher.full_name || teacher.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="ACTIVE" rules={[{ required: true, message: "Status majburiy!" }]}> 
            <Select disabled={loading}> 
              <Select.Option value="ACTIVE">Faol</Select.Option> 
              <Select.Option value="INACTIVE">Nofaol</Select.Option> 
              <Select.Option value="DRAFT">Qoralama</Select.Option> 
            </Select> 
          </Form.Item>
          <Form.Item name="start_date" label="Boshlanish sanasi"> 
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button onClick={onClose} disabled={loading} style={{ marginRight: 8 }}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddGroupModal;
