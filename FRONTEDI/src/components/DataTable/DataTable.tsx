import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Checkbox, Space, Modal } from "antd";
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
}

const DataTable: React.FC<DataTableProps> = ({ data = [], type, person, onEdit, onDelete, onDetail, onAddMember, onAddTeacher }) => {
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
          title: "Bolalar F.I.O",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span
              className="cursor-pointer text-blue-600"
              onClick={() => onEdit && onEdit(record)}
            >
              <UserOutlined style={{ fontSize: 20, color: '#1890ff' }} /> {text}
            </span>
          ),
        },
        {
          title: "Tug'ilgan sana",
          dataIndex: "birthDate",
          key: "birthDate",
        },
        {
          title: "Jinsi",
          dataIndex: "gender",
          key: "gender",
          render: (gender) => (
            <span className={gender === "O'g'il bola" ? "text-green-600" : "text-red-600"}>{gender}</span>
          ),
        },
        {
          title: "Gurux raqami",
          dataIndex: "group",
          key: "group",
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
          title: "O'qituvchilar F.I.O",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Tug'ilgan sana",
          dataIndex: "birthDate",
          key: "birthDate",
        },
        {
          title: "Jinsi",
          dataIndex: "gender",
          key: "gender",
        },
        {
          title: "Kontakt",
          dataIndex: "contact",
          key: "contact",
        },
        {
          title: "Imkoniyatlar",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Tooltip title="Tahrirlash">
                <Button type="link" icon={<img src={images.pen_icon} alt="edit" width={22} height={22} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" icon={<img src={images.deleteIcon} alt="delete" width={22} height={22} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
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
          render: (text, record) => <span className="cursor-pointer text-blue-600" onClick={() => onDetail && onDetail(record)}>{text}</span>,
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
                <Button type="link" icon={<img src={images.pen_icon} alt="edit" width={22} height={22} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" icon={<img src={images.deleteIcon} alt="delete" width={22} height={22} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
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
                <Button type="link" icon={<img src={images.pen_icon} alt="edit" width={22} height={22} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" icon={<img src={images.deleteIcon} alt="delete" width={22} height={22} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
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
          title: "Bolalar F.I.O",
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
                <Button type="link" icon={<img src={images.pen_icon} alt="edit" width={22} height={22} />} onClick={() => onEdit && onEdit(record)} />
              </Tooltip>
              <Tooltip title="O'chirish">
                <Button type="link" icon={<img src={images.deleteIcon} alt="delete" width={22} height={22} />} onClick={() => onDelete && onDelete(record.user_id || record.id)} />
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
    <div className="overflow-x-auto">
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
