import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";
import { getEntityId } from "../../utils/getEntityId";

interface AddAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groups?: any[];
  lessons?: any[];
  students?: any[];
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ open, onClose, onSuccess, groups = [], lessons = [], students = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // YANGI: Guruh bo'yicha talabalar yuklash uchun state va effektlar
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [groupStudents, setGroupStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // YANGI: Guruh bo'yicha darslar yuklash uchun state
  const [groupLessons, setGroupLessons] = useState<any[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  // Modal ochilganda state va selectlarni tozalash
  useEffect(() => {
    if (!open) {
      setSelectedGroupId(undefined);
      setGroupStudents([]);
      setGroupLessons([]);
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values: any) => {
    if (!values.student_id || !values.date || !values.status || !values.group_id || !values.lesson_id) {
      message.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    try {
      await instance.post("/attendance", {
        student_id: getEntityId(values.student_id) || values.student_id,
        status: values.status,
        date: values.date ? (typeof values.date === "string" ? values.date : values.date.format ? values.date.format("YYYY-MM-DD") : values.date.toISOString()) : undefined,
        lesson_id: getEntityId(values.lesson_id) || values.lesson_id,
        group_id: getEntityId(values.group_id) || values.group_id,
      });
      message.success("Davomat qo'shildi!");
      form.resetFields();
      setSelectedGroupId(undefined); // Selectlarni tozalash
      setGroupStudents([]);
      setGroupLessons([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Davomat qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // Guruh tanlanganda talabalar va darslarni yuklash
  type GroupType = { group_id?: string; _id?: string; id?: string; name?: string };
  const handleGroupChange = async (groupId: string) => {
    setSelectedGroupId(groupId);
    form.setFieldsValue({ student_id: undefined, lesson_id: undefined }); // Talaba va dars selectini tozalash
    setGroupStudents([]);
    setGroupLessons([]);
    if (!groupId) return;
    setStudentsLoading(true);
    setLessonsLoading(true);
    try {
      // Talabalar uchun
      const studentsRes = await instance.get(`/groups/${groupId}/members`);
      setGroupStudents(studentsRes.data || []);
    } catch (err: any) {
      message.error("Guruh talabalarini yuklashda xatolik");
      setGroupStudents([]);
    } finally {
      setStudentsLoading(false);
    }
    try {
      // Darslar uchun (endi backend to'g'ri ishlaydi)
      const lessonsRes = await instance.get(`/groups/${groupId}/lessons`);
      setGroupLessons(lessonsRes.data || []);
    } catch (err: any) {
      message.error("Guruh darslarini yuklashda xatolik");
      setGroupLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Davomat qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: 'Guruhni tanlang' }]}> 
            <Select
              placeholder="Guruh tanlang"
              options={groups.map(g => ({ value: g.group_id || g._id || g.id, label: g.name }))}
              showSearch
              optionFilterProp="label"
              loading={!groups.length}
              onChange={handleGroupChange}
              value={selectedGroupId}
            />
          </Form.Item>
          <Form.Item name="lesson_id" label="Dars" rules={[{ required: true, message: 'Darsni tanlang' }]}> 
            <Select
              placeholder="Dars tanlang"
              options={groupLessons.map(l => ({ value: l.lesson_id || l._id || l.id, label: l.topic + (l.lesson_date ? ' (' + new Date(l.lesson_date).toLocaleDateString() + ')' : '') }))}
              showSearch
              optionFilterProp="label"
              loading={lessonsLoading}
              disabled={!selectedGroupId}
            />
          </Form.Item>
          <Form.Item name="student_id" label="Talaba" rules={[{ required: true, message: 'Talabani tanlang' }]}> 
            <Select
              placeholder="Talaba tanlang"
              options={groupStudents.map(s => ({ value: s.user_id || s.student_id || s._id || s.id, label: s.name + (s.lastname ? ' ' + s.lastname : '') }))}
              showSearch
              optionFilterProp="label"
              loading={studentsLoading}
              disabled={!selectedGroupId}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Statusni tanlang' }]}> 
            <Select
              placeholder="Status tanlang"
              options={[
                { value: "PRESENT", label: "Kelgan" },
                { value: "ABSENT", label: "Kelmagan" },
                { value: "LATE", label: "Kechikkan" },
                { value: "EXCUSED", label: "Sababli" }
              ]}
            />
          </Form.Item>
          <Form.Item name="date" label="Sana" rules={[{ required: true, message: 'Sanani tanlang' }]}> 
            <DatePicker className="w-full" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAttendanceModal;
