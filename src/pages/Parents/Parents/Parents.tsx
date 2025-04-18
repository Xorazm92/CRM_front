
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { parentsService } from "../../../services/parents";
import Filter from "../../../components/Filter/Filter";

interface ParentData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  job: string;
}

const Parents: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents'],
    queryFn: parentsService.getAll
  });

  const columns: ColumnsType<ParentData> = [
    {
      title: 'Ism',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Familiya',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Kasbi',
      dataIndex: 'job',
      key: 'job',
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
    navigate(`/parents/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await parentsService.delete(id);
      message.success("Ota-ona muvaffaqiyatli o'chirildi");
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ota-onalar ro'yxati</h1>
        <div className="flex gap-4">
          <Button 
            type="primary"
            onClick={() => navigate("/add-parents")}
            className="bg-blue-600"
          >
            Yangi qo'shish
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
          dataSource={parents}
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

export default Parents;
