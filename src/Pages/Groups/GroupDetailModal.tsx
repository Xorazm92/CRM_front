// Migration placeholder for GroupDetailModal.jsx to .tsx
// The actual code will be migrated from the .jsx file and refactored to TypeScript.

import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, Collapse, List, Typography } from "antd";
import instance from "../../api/axios";

interface GroupMember {
  group_member_id: string;
  user: {
    user_id: string;
    full_name?: string;
    name?: string;
    phone_number?: string;
    [key: string]: any;
  };
  created_at?: string;
}

interface GroupDetailModalProps {
  groupId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({ groupId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && groupId) {
      setLoading(true);
      setError("");
      instance.get(`/groups/${groupId}`)
        .then(res => {
          setGroup(res.data);
          // group_members massivini groupdan olamiz
          // (agar yo‘q bo‘lsa, bo‘sh array)
          // Konsolga chiqarish: backenddan kelayotgan group obyektini tekshirish uchun
          console.log("GROUP RESPONSE:", res.data);
        })
        .catch(err => setError(err?.response?.data?.message || err.message || "Xatolik"))
        .finally(() => setLoading(false));
    } else if (!isOpen) {
      setGroup(null);
      setError("");
    }
  }, [isOpen, groupId]);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruh tafsilotlari" destroyOnClose>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin size="large" /></div>
      ) : error ? (
        <div style={{ color: 'red', padding: 24 }}>{error}</div>
      ) : group ? (
        <>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Nomi">{group.name}</Descriptions.Item>
            <Descriptions.Item label="Tavsif">{group.description}</Descriptions.Item>
            <Descriptions.Item label="Status">{group.status}</Descriptions.Item>
            <Descriptions.Item label="Kurs">{group.course?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="O'qituvchi">{group.teacher?.full_name || group.teacher?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Boshlanish sanasi">{group.start_date || '-'}</Descriptions.Item>
          </Descriptions>
          <Collapse style={{ marginTop: 24 }}>
            <Collapse.Panel header="Guruhdagi o'quvchilar" key="students">
              {group.group_members?.length === 0 ? (
                <Typography.Text type="secondary">O'quvchilar topilmadi</Typography.Text>
              ) : (
                <List
                  dataSource={group.group_members}
                  renderItem={(gm: GroupMember) => (
                    <List.Item key={gm.group_member_id}>
                      <b>{gm.user.full_name || gm.user.name}</b>
                      {gm.user.phone_number ? ` - ${gm.user.phone_number}` : ""}
                      {/* {gm.created_at ? ` (Qo'shilgan: ${new Date(gm.created_at).toLocaleDateString()})` : ""} */}
                    </List.Item>
                  )}
                />
              )}
            </Collapse.Panel>
          </Collapse>
        </>
      ) : (
        <div style={{ padding: 24 }}>Ma'lumot topilmadi</div>
      )}
    </Modal>
  );
};

export default GroupDetailModal;
