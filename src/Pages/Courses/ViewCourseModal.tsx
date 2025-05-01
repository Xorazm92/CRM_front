import React, { useEffect, useState } from "react";
import { Modal, List, Spin, Typography, Descriptions, Badge, Empty, Card } from "antd";
import { BookOutlined, InfoCircleOutlined, ClockCircleOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ViewCourseModal.module.css";
import instance from "../../api/axios";
import GroupDetailModal from "./GroupDetailModal";

interface CourseType {
  course_id: string | number;
  name: string;
  description: string;
  duration: number;
  status: string;
}

interface GroupType {
  _id: string;
  name: string;
  teacher_name?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  course: CourseType | null;
}

const ViewCourseModal: React.FC<Props> = ({ open, onClose, course }) => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupDetail, setGroupDetail] = useState<any>(null);
  const [groupDetailLoading, setGroupDetailLoading] = useState(false);

  // Guruhga bosilganda to'liq ma'lumotlarni olish
  const handleGroupClick = async (groupId: string) => {
    setGroupDetailLoading(true);
    try {
      const res = await instance.get(`/groups/${groupId}/full`);
      setGroupDetail(res.data);
    } catch {
      setGroupDetail(null);
    } finally {
      setGroupDetailLoading(false);
    }
  };

  useEffect(() => {
    if (open && course) {
      setLoading(true);
      instance.get(`/groups?course_id=${course.course_id}`)
        .then(res => {
          const groupsArr = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setGroups(groupsArr);
        })
        .catch(() => setGroups([]))
        .finally(() => setLoading(false));
    } else {
      setGroups([]);
    }
  }, [open, course]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={course ? <><BookOutlined /> Kurs haqida ma'lumot</> : "Kurs haqida ma'lumot"}
      footer={null}
      width={540}
      styles={{ body: { padding: 24 } }}
    >
      {course ? (
        <>
          <Card variant="outlined" className={styles.modalCard}>
            <Descriptions
              column={1}
              styles={{ label: { fontWeight: 500 }, content: { fontWeight: 400 } }}
            >
              <Descriptions.Item label={<span className={styles.infoIcon}><BookOutlined /> Nomi</span>}>
                {course.name}
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.infoIcon}><InfoCircleOutlined /> Izoh</span>}>
                {course.description}
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.infoIcon}><ClockCircleOutlined /> Davomiyligi</span>}>
                {course.duration} oy
              </Descriptions.Item>
              <Descriptions.Item label={<span>Status</span>}>
                <Badge
                  className={styles.statusBadge}
                  status={course.status === 'ACTIVE' ? 'success' : 'default'}
                  text={course.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card> 
          <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
            <TeamOutlined /> Ushbu kursga tegishli guruhlar:
          </Typography.Title>
          {loading ? (
            <Spin />
          ) : groups.length === 0 ? (
            <Empty description="Guruhlar topilmadi" className={styles.emptyBlock} />
          ) : (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={groups}
              renderItem={g => (
                <List.Item key={g._id}>
                  <Card
                    bordered
                    hoverable
                    className={styles.groupCard}
                    style={{ padding: 12 }}
                    onClick={() => g._id && handleGroupClick(g._id)}
                  >
                    <Typography.Text strong className={styles.groupTitle}>
                      <UserOutlined /> {g.name}
                    </Typography.Text>
                    {g.teacher_name && (
                      <Typography.Text className={styles.groupTeacher} type="secondary">
                        <UserOutlined /> O'qituvchi: {g.teacher_name}
                      </Typography.Text>
                    )}
                  </Card>
                </List.Item> 
              )}
            />
          )}
        </>
      ) : null}
      <GroupDetailModal
        open={!!groupDetail}
        onClose={() => setGroupDetail(null)}
        group={groupDetail}
      />
    </Modal>
  );
};

export default ViewCourseModal;
