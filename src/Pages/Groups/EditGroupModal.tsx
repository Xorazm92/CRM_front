import React from "react";
import { Modal, Form, Input, Select, Button, DatePicker, Spin, message } from "antd";
import dayjs from "dayjs";
import instance from "../../api/axios";
import type { GroupType } from "./Groups";

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

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupEdited: () => Promise<void>;
  group: GroupType | null;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ isOpen, onClose, onGroupEdited, group }) => {
  const [form] = Form.useForm<GroupType & { course_id: string; teacher_id: string; start_date?: string }>();
  const [loading, setLoading] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      instance.get("/course").then(res => {
        setCourses(Array.isArray(res.data.data) ? res.data.data : []);
      });
      instance.get("/users?role=TEACHER").then(res => {
        setTeachers(Array.isArray(res.data.data) ? res.data.data : []);
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && group) {
      form.setFieldsValue({
        ...group,
        course_id: group.course_id || group.course?.course_id || '',
        teacher_id: group.teacher?.user_id || '',
        start_date: group.start_date ? dayjs(group.start_date) : undefined,
      });
    } else if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, group, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        start_date: values.start_date ? dayjs(values.start_date).format("YYYY-MM-DD") : undefined,
      };
      await instance.put(`/groups/${group?.group_id}`, payload);
      message.success("Guruh yangilandi!");
      onGroupEdited && onGroupEdited();
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruhni tahrirlash" destroyOnClose>
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
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> 
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
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditGroupModal;
