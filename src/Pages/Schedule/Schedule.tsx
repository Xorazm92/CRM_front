import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { List, Spin, Typography, Tag } from "antd";

interface ScheduleType {
  schedule_id: string;
  group_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
}

const days = [
  "Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"
];

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance.get("/schedule")
      .then(res => {
        // If backend returns { data: [...] }, unwrap it
        if (Array.isArray(res.data)) setSchedules(res.data);
        else if (Array.isArray(res.data?.data)) setSchedules(res.data.data);
        else setSchedules([]);
      })
      .catch((err) => {
        setSchedules([]);
        window?.console?.error?.("Schedule API error:", err);
        // Optionally show antd message.error here
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <Typography.Title level={3}>Dars jadvali</Typography.Title>
      <Spin spinning={loading}>
        <List
          dataSource={schedules}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<>
                  <Tag color="blue">Guruh: {item.group_id}</Tag>
                  <Tag color="purple">{days[item.day_of_week % 7]}</Tag>
                </>}
                description={<>
                  <span>Boshlanish: <b>{new Date(item.start_time).toLocaleTimeString()}</b></span> —
                  <span> Tugash: <b>{new Date(item.end_time).toLocaleTimeString()}</b></span><br/>
                  {item.room && <span>Xona: {item.room}</span>}
                </>}
              />
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

export default Schedule;
