// Converted from GroupDetailModal.jsx to GroupDetailModal.tsx with full TypeScript support
import React, { useEffect, useState } from "react";
import { Modal, Spin, Table, Typography, Tag } from "antd";
import instance from "../../api/axios";

interface GroupDetailModalProps {
  isOpen: boolean;
  groupId: string | number | undefined;
  onClose: () => void;
}

interface GroupDetail {
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  course?: { name: string };
  teachers?: { full_name?: string; name?: string }[];
  students?: { full_name?: string; name?: string }[];
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({ isOpen, groupId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<GroupDetail | null>(null);

  useEffect(() => {
    if (isOpen && groupId) {
      setLoading(true);
      instance.get(`/groups/${groupId}`).then(res => {
        setGroup(res.data.data || res.data);
      }).catch(() => setGroup(null)).finally(() => setLoading(false));
    }
  }, [isOpen, groupId]);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruh tafsilotlari" destroyOnClose width={600}>
      <Spin spinning={loading}>
        {group ? (
          <div>
            <Typography.Title level={4}>{group.name}</Typography.Title>
            <p><b>Tavsif:</b> {group.description}</p>
            <p><b>Holat:</b> <Tag color={group.status === 'ACTIVE' ? 'green' : group.status === 'INACTIVE' ? 'red' : 'blue'}>{group.status}</Tag></p>
            <p><b>Boshlanish sanasi:</b> {group.start_date}</p>
            <p><b>Kurs:</b> {group.course?.name}</p>
            <p><b>O'qituvchilar:</b> {group.teachers?.map(t => t.full_name || t.name).join(", ")}</p>
            <p><b>O'quvchilar soni:</b> {group.students?.length}</p>
            <Table
              dataSource={group.students}
              columns={[
                { title: "F.I.Sh.", dataIndex: "full_name", key: "full_name", render: (_: any, r: any) => r.full_name || r.name },
              ]}
              rowKey={(r) => r.full_name || r.name}
              pagination={false}
              size="small"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">Ma'lumot topilmadi</div>
        )}
      </Spin>
    </Modal>
  );
};

export default GroupDetailModal;
