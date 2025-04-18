
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { groupsService } from "../../../services/groups";
import Filter from "../../../components/Filter/Filter";

interface GroupData {
  id: string;
  name: string;
  teacherId: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
  studentsCount: number;
  startTime: string;
  endTime: string;
}

const Group: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsService.getAll
  });

  const columns: ColumnsType<GroupData> = [
    {
      title: 'Guruh nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "O'qituvchi",
      key: 'teacher',
      render: (_, record) => (
        <span>{record.teacher.firstName} {record.teacher.lastName}</span>
      ),
    },
    {
      title: "O'quvchilar soni",
      dataIndex: 'studentsCount',
      key: 'studentsCount',
    },
    {
      title: 'Dars vaqti',
      key: 'time',
      render: (_, record) => (
        <span>{record.startTime} - {record.endTime}</span>
      ),
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record.id)}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            O'zgartirish
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            O'chirish
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    navigate(`/groups/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await groupsService.delete(id);
      message.success("Guruh muvaffaqiyatli o'chirildi");
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlar ro'yxati</h1>
        <div className="flex gap-4">
          <Button 
            type="primary"
            onClick={() => navigate("/add-group")}
            className="bg-blue-600"
          >
            Yangi guruh
          </Button>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            icon={<FilterOutlined />}
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={groups}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>

      {isFilterOpen && (
        <Filter closeFilter={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
};

export default Group;
