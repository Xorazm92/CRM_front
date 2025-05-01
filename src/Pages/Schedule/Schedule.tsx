
import React, { useState, useEffect } from 'react';
import { Calendar, Badge, message } from 'antd';
import type { Dayjs } from 'dayjs';
import instance from '../../api/axios';

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  type: 'success' | 'warning' | 'error';
}

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await instance.get('/schedule');
      setEvents(res.data);
    } catch (err) {
      message.error('Dars jadvalini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const dayEvents = events.filter(
      event => value.format('YYYY-MM-DD') === event.date
    );

    return (
      <ul className="events">
        {dayEvents.map(event => (
          <li key={event.id}>
            <Badge status={event.type} text={event.title} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Calendar
        loading={loading}
        dateCellRender={dateCellRender}
      />
    </div>
  );
};

export default Schedule;
