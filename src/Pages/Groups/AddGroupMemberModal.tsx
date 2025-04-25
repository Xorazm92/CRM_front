// Converted from AddGroupMemberModal.jsx to AddGroupMemberModal.tsx with full TypeScript support
import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message, Spin } from "antd";
import instance from "../../api/axios";
import { getEntityId } from "../../utils/getEntityId";

interface AddGroupMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | number;
  onMembersAdded?: () => void;
}

interface StudentType {
  id?: string;
  user_id?: string;
  full_name?: string;
  name?: string;
  username?: string;
}

const AddGroupMemberModal: React.FC<AddGroupMemberModalProps> = ({ isOpen, onClose, groupId, onMembersAdded }) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<StudentType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      instance.get("/student").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setStudents(data);
      }).catch(() => {
        setStudents([]);
      });
    }
  }, [isOpen]);

  const handleFinish = async () => {
    if (!selected.length) {
      message.error("Kamida bitta o'quvchini tanlang");
      return;
    }
    setLoading(true);
    try {
      await instance.post("/admin/addMembersToGroup", {
        group_id: groupId,
        user_ids: selected.map(id => getEntityId(students.find(s => getEntityId(s) === id)) || id)
      });
      message.success("A'zolar muvaffaqiyatli qo'shildi!");
      onMembersAdded && onMembersAdded();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title={"Guruhga a'zo qo'shish"} destroyOnClose>
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item label="O'quvchilarni tanlang" required>
            <Select
              mode="multiple"
              allowClear
              value={selected}
              onChange={setSelected}
              placeholder="O'quvchilarni tanlang"
              options={students.map(s => ({ value: getEntityId(s), label: s.full_name || s.name || s.username || 'No name' }))}
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

export default AddGroupMemberModal;
