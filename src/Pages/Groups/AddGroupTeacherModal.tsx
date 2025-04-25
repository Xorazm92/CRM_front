// Converted from AddGroupTeacherModal.jsx to AddGroupTeacherModal.tsx with full TypeScript support
import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message, Spin } from "antd";
import instance from "../../api/axios";
import { getEntityId } from "../../utils/getEntityId";

interface AddGroupTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | number;
  onTeachersAdded?: () => void;
}

interface TeacherType {
  id?: string;
  _id?: string;
  full_name?: string;
  name?: string;
  username?: string;
}

const AddGroupTeacherModal: React.FC<AddGroupTeacherModalProps> = ({ isOpen, onClose, groupId, onTeachersAdded }) => {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      instance.get("/teacher").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setTeachers(data);
      }).catch(() => {
        setTeachers([]);
      });
    }
  }, [isOpen]);

  const handleFinish = async () => {
    if (!selected.length) {
      message.error("Kamida bitta o'qituvchini tanlang");
      return;
    }
    setLoading(true);
    try {
      await instance.post("/admin/addTeachersToGroup", {
        group_id: groupId,
        teacher_ids: selected.map(id => getEntityId(teachers.find(t => getEntityId(t) === id)) || id)
      });
      message.success("O'qituvchilar muvaffaqiyatli qo'shildi!");
      onTeachersAdded && onTeachersAdded();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title={"Guruhga o'qituvchi qo'shish"} destroyOnClose>
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item label="O'qituvchilarni tanlang" required>
            <Select
              mode="multiple"
              allowClear
              value={selected}
              onChange={setSelected}
              placeholder="O'qituvchilarni tanlang"
              options={teachers.map(t => ({ value: getEntityId(t), label: t.full_name || t.name || t.username || 'No name' }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>+ Qo'shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddGroupTeacherModal;
