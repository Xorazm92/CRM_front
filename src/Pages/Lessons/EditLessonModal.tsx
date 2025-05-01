import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Select, Spin, message } from "antd";
import instance from "../../api/axios";
import dayjs from "dayjs";
import "./edit-lesson-modal.css";

interface GroupType {
  group_id?: string;
  _id?: string;
  name: string;
  course_id?: string;
  teacher_id?: string;
}
interface CourseType {
  _id?: string;
  id?: string;
  course_id?: string;
  name: string;
}
interface UserType {
  _id?: string;
  id?: string;
  user_id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  full_name?: string; 
}
interface EditLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lesson: any;
}
interface EditLessonForm {
  group_id: string;
  topic: string;
  lesson_date: any;
  recording_path: string;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({ open, onClose, onSuccess, lesson }) => {
  const [form] = Form.useForm<EditLessonForm>();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [teachers, setTeachers] = useState<UserType[]>([]);

  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, coursesRes, usersRes] = await Promise.all([
        instance.get('/groups'),
        instance.get('/course'),
        instance.get('/users')
      ]);
      
      setGroups(groupsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
      
      const allUsers = usersRes.data.data || [];
      const onlyTeachers = allUsers.filter((user: any) => 
        user.role === 'TEACHER' || user.role === 'teacher'
      );
      
      // Add full_name property to teachers if needed
      const teachersWithFullName = onlyTeachers.map((teacher: UserType) => {
        if (!teacher.full_name) {
          teacher.full_name = `${teacher.name || ''} ${teacher.middlename || ''} ${teacher.lastname || ''}`.trim();
        }
        return teacher;
      });
      
      setTeachers(teachersWithFullName);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Set form values when lesson prop changes or modal opens
  useEffect(() => {
    if (lesson && open) {
      console.log("Setting form values with lesson:", lesson);
      
      // Determine the correct ID fields
      const groupId = lesson.group_id || lesson.group?._id || lesson.group?.group_id || '';
      const lessonDate = lesson.lesson_date || lesson.date;
      
      form.setFieldsValue({
        group_id: groupId,
        topic: lesson.topic || '',
        lesson_date: lessonDate ? dayjs(lessonDate) : null,
        recording_path: lesson.recording_path || lesson.recording || ''
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [lesson, open, form]);

  // Find selected group and related info for display
  const selectedGroupId = form.getFieldValue('group_id');
  const selectedGroup = groups.find(g => 
    g.group_id === selectedGroupId || g._id === selectedGroupId
  );
  
  const courseName = React.useMemo(() => {
    if (!selectedGroup || !courses.length) return '';
    
    const courseId = selectedGroup.course_id;
    const course = courses.find(c => 
      c._id === courseId || c.id === courseId || c.course_id === courseId
    );
    
    return course?.name || '';
  }, [selectedGroup, courses]);
  
  const teacherName = React.useMemo(() => {
    if (!selectedGroup || !teachers.length) return '';
    
    const teacherId = selectedGroup.teacher_id;
    const teacher = teachers.find(t => 
      t._id === teacherId || t.id === teacherId || t.user_id === teacherId
    );
    
    return teacher?.full_name || '';
  }, [selectedGroup, teachers]);

  const handleFinish = async (values: EditLessonForm) => {
    if (!values.group_id || !values.topic || !values.lesson_date) {
      message.error("Barcha maydonlarni to'ldiring");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...values,
        lesson_date: dayjs(values.lesson_date).toISOString()
      };
      
      // Determine the correct lesson ID
      const lessonId = lesson.lesson_id || lesson.id || lesson._id;
      
      await instance.patch(`/lesson/${lessonId}`, payload);
      message.success("Dars tahrirlandi!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Darsni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh tanlang!" }]}>
            <Select 
              disabled={loading} 
              placeholder="Guruh tanlang"
              showSearch
              optionFilterProp="children"
            >
              {groups.map((g) => (
                <Select.Option key={g.group_id || g._id} value={g.group_id || g._id}>
                  {g.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="topic" label="Mavzu" rules={[{ required: true, message: "Mavzuni kiriting!" }]}>
            <Input disabled={loading} />
          </Form.Item>
          
          <Form.Item name="lesson_date" label="Dars sanasi" rules={[{ required: true, message: "Sanani tanlang!" }]}>
            <DatePicker showTime className="edit-lesson-modal-date" disabled={loading} />
          </Form.Item>
          
          <Form.Item name="recording_path" label="Yozuv yo'li">
            <Input disabled={loading} />
          </Form.Item>
          
          <Form.Item label="Kurs">
            <Input value={courseName} disabled readOnly />
          </Form.Item>
          
          <Form.Item label="O'qituvchi">
            <Input value={teacherName} disabled readOnly />
          </Form.Item>
          
          <div className="edit-lesson-modal-actions">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditLessonModal;