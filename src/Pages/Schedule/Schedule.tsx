import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Tag, Card, Empty } from "antd";

interface ScheduleType {
  schedule_id: string;
  group_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
}

interface Group {
  group_id: string;
  name: string;
} 

const days = [
  "Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"
];

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      instance.get("/schedule"),
      instance.get("/groups")
    ])
      .then(([scheduleRes, groupRes]) => {
        const sch = Array.isArray(scheduleRes.data) ? scheduleRes.data : scheduleRes.data?.data || [];
        const gr = Array.isArray(groupRes.data) ? groupRes.data : groupRes.data?.data || [];
        setSchedules(sch);
        setGroups(gr);
      })
      .catch((err) => {
        setSchedules([]);
        setGroups([]);
        window?.console?.error?.("Schedule yoki Guruh API xatosi:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Guruh nomini topish uchun yordamchi funksiya
  const getGroupName = (group_id: string) => {
    const group = groups.find(g => g.group_id === group_id);
    return group ? group.name : group_id;
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <Typography.Title level={3}>Dars jadvali</Typography.Title>
      <Spin spinning={loading}>
        {schedules.length === 0 ? (
          <Empty description="Darslar topilmadi" />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={schedules}
            renderItem={item => (
              <List.Item>
                <Card
                  title={<>
                    <Tag color="blue">Guruh: {getGroupName(item.group_id)}</Tag>
                    <Tag color="purple">{days[item.day_of_week % 7]}</Tag>
                  </>}
                  bordered
                  style={{ minWidth: 300 }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <span>Boshlanish vaqti: <b>{new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b></span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span>Tugash vaqti: <b>{new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b></span>
                  </div>
                  {item.room && (
                    <div>
                      <span>Xona: <b>{item.room}</b></span>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );
};

export default Schedule;
