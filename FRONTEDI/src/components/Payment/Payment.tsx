import React from "react";
import { Modal, Descriptions } from "antd";
import images from "../../images";

interface Person {
  name: string;
  paymentMethod?: string;
  amount?: string | number;
}

interface PaymentProps {
  personId?: string | number | null;
  onClose: () => void;
  person?: Person;
}

const Payment: React.FC<PaymentProps> = ({ personId, onClose, person }) => {
  if (!person) return null;

  const nameParts = person.name.split(" ");
  const lastName = nameParts[0] || "";
  const firstName = nameParts[1] || "";
  const patronymic = nameParts.slice(2).join(" ") || "N/A";

  return (
    <Modal
      open={!!personId}
      onCancel={onClose}
      footer={null}
      title={<div className="flex items-center justify-between"><span>To'lov jadvali</span><button className="bg-transparent border-none" onClick={onClose}><img width={24} src={images.x_icon} alt="close" /></button></div>}
      closable={false}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Ism">{firstName}</Descriptions.Item>
        <Descriptions.Item label="Familiya">{lastName}</Descriptions.Item>
        <Descriptions.Item label="Sharfi">{patronymic}</Descriptions.Item>
        <Descriptions.Item label="To'lov">{person.paymentMethod || "Naqd"}</Descriptions.Item>
        <Descriptions.Item label="Summa">{person.amount || "500 000 so'm"}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Payment;
