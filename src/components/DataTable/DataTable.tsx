import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Space, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  UserOutlined
} from "@ant-design/icons";
import Payment from "../Payment/Payment";
import images from '../../images/images';
import CustomButton from '../Button/Button';

interface PersonType {
  id?: string | number;
  user_id?: string | number;
  name?: string;
  birthDate?: string;
  gender?: string;
  group?: string;
  attendance?: boolean;
  contact?: string;
  count?: number;
  school_length?: string;
  payment_status?: string;
  jobs?: string;
  date?: string;
  summa?: number | string;
  [key: string]: any;
}

interface DataTableProps {
  data: PersonType[];
  type: string;
  person?: any;
  onEdit?: (person: PersonType) => void;
  onDelete?: (id: string | number) => void;
  onDetail?: (person: PersonType) => void;
  onAddMember?: (person: PersonType) => void;
  onAddTeacher?: (person: PersonType) => void;
  onAddGroup?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data = [], type, person, onEdit, onDelete, onDetail, onAddMember, onAddTeacher, ...props }) => {
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | number | null>(null);

  const handlePaymentClick = (personId: string | number) => {
    setSelectedPersonId(personId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPersonId(null);
  };

  useEffect(() => {}, [data]);

  const handleCheckboxChange = (id: string | number) => {
    setIsChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  let columns: ColumnsType<PersonType> = [];

  switch (type) {
    case "students":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "O‘quvchilar ismi",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span
              className="student-table-link"
              onClick={() => onDetail ? onDetail(record) : (onEdit && onEdit(record))}
              style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
            >
              <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} /> {text}
            </span>
          ),
        },
        {
          title: "Tug'ilgan sana",
          dataIndex: "birthDate",
          key: "birthDate",
          render: (date) => date ? new Date(date).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }) : '',
        },
        {
          title: "Jinsi",
          dataIndex: "gender",
          key: "gender",
          render: (gender) => (
            <span className={gender === "O'g'il bola" ? "gender-male" : "gender-female"}>{gender}</span>
          ),
        },

        {
          title: "Davomat",
          dataIndex: "attendance",
          key: "attendance",
          render: (attendance) => (
            attendance 
              ? <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 22 }} /> 
              : <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 22 }} />
          ),
        },
        {
          title: "To'lov",
          key: "payment",
          render: (_, record) => (
            <Button icon={<DollarCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />} onClick={() => handlePaymentClick(record.id)} />
          ),
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    case "teachers":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "O‘qituvchilar ismi",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span
              className="teacher-table-link"
              onClick={() => onDetail && onDetail(record)}
              style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
            >
              <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} /> {text}
            </span>
          ),
        },
        {
          title: "Tug'ilgan sana",
          dataIndex: "birthDate",
          key: "birthDate",
          render: (date) => date ? new Date(date).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '',
        },
        {
          title: "Jinsi",
          dataIndex: "gender",
          key: "gender",
          render: (gender) => {
            if (!gender) return '';
            const g = gender.toLowerCase();
            if (g.includes("male") || g.includes("o‘g‘il")) return "O‘g‘il bola";
            if (g.includes("female") || g.includes("qiz")) return "Qiz bola";
            return gender;
          },
        },
        {
          title: "Kontakt",
          dataIndex: "phone_number",
          key: "phone_number",
        },

        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    case "groups":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "Nomi",
          dataIndex: "name",
          key: "name",
          render: (text, record) => <span className="student-table-link" onClick={() => onDetail && onDetail(record)}>{text}</span>,
        },
        {
          title: "Boshlangan sana",
          dataIndex: "startDate",
          key: "startDate",
        },
        {
          title: "Daraja",
          dataIndex: "level",
          key: "level",
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
              <Tooltip title="Student qo‘shish">
                <Button type="link" icon={<img src={images.usersThree} alt="student add" width={22} height={22} />} onClick={() => onAddMember && onAddMember(record)} />
              </Tooltip>
              <Tooltip title="Teacher qo‘shish">
                <Button type="link" icon={<img src={images.group} alt="teacher add" width={22} height={22} />} onClick={() => onAddTeacher && onAddTeacher(record)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    case "parents":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "Ota-Onalar F.I.O",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Tel raqam",
          dataIndex: "contact",
          key: "contact",
        },
        {
          title: "Farzandlar soni",
          dataIndex: "count",
          key: "count",
        },
        {
          title: "Maktab davomiyligi",
          dataIndex: "school_length",
          key: "school_length",
        },
        {
          title: "To'lov holati",
          dataIndex: "payment_status",
          key: "payment_status",
        },
        {
          title: "Kasbi",
          dataIndex: "jobs",
          key: "jobs",
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    case "lessons":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "Guruh",
          dataIndex: "group",
          key: "group",
          render: (group: string) => group && group.trim() !== '' ? group : <span style={{color:'#aaa'}}>-</span>,
        },
        {
          title: "O‘quvchilar ",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Jinsi",
          dataIndex: "gender",
          key: "gender",
          render: (gender) => (
            <span className={gender === "O'g'il bola" ? "gender-male" : "gender-female"}>{gender}</span>
          ),
        },

        {
          title: "Davomat",
          dataIndex: "attendance",
          key: "attendance",
          render: (attendance) => (
            attendance 
              ? <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 22 }} /> 
              : <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 22 }} />
          ),
        },
        {
          title: "To'lov",
          key: "payment",
          render: (_, record) => (
            <Button icon={<DollarCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />} onClick={() => handlePaymentClick(record.id)} />
          ),
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    case "reports":
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
        {
          title: "O‘quvchilar ",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Sana",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Summa",
          dataIndex: "summa",
          key: "summa",
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<EditOutlined style={{ color: '#1890ff', fontSize: 20 }} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 20 }} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
              </Tooltip>
            </Space>
          ),
        },
      ];
      break;
    default:
      columns = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, idx: number) => <span>{idx + 1}</span>,
        },
      ];
  }

  if (!data || data.length === 0) {
    return <div>Ma'lumotlar mavjud emas</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => String(record.user_id || record.id || record.name)}
        className="bg-white rounded shadow"
      />
      <Modal open={isModalOpen} onCancel={closeModal} footer={null}>
        <Payment personId={selectedPersonId} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default DataTable;
