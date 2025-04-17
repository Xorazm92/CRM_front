import { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services/attendance';
import { studentService } from '../services/students';
import { groupsService } from '../services/groups';

const Attendance = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getAll
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const { data: groupsData } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsService.getAll
  });

  const createMutation = useMutation({
    mutationFn: attendanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      message.success("Davomat qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const columns = [
    { title: 'O‘quvchi', dataIndex: ['student', 'fullName'] },
    { title: 'Guruh', dataIndex: ['group', 'name'] },
    { title: 'Sana', dataIndex: 'date' },
    { title: 'Holat', dataIndex: 'status' },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Davomat qo‘shish
      </Button>
      <Table
        columns={columns}
        dataSource={attendance}
        loading={isLoading}
        rowKey="id"
      />
      <Modal
        title="Davomat qo‘shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={createMutation.mutate} layout="vertical">
          <Form.Item name="studentId" label="O‘quvchi" rules={[{ required: true }]}> 
            <Select placeholder="O‘quvchini tanlang" showSearch optionFilterProp="children">
              {(studentsData?.data || []).map((student: any) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="groupId" label="Guruh" rules={[{ required: true }]}> 
            <Select placeholder="Guruhni tanlang" showSearch optionFilterProp="children">
              {(groupsData?.data || []).map((group: any) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Sana" rules={[{ required: true }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Holat" rules={[{ required: true }]}> 
            <Select>
              <Select.Option value="present">Kelgan</Select.Option>
              <Select.Option value="absent">Kelmagan</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Attendance;
