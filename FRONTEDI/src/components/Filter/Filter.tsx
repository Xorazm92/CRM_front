import React, { useState } from "react";
import { Modal, Button, Select, DatePicker, Checkbox, Form } from "antd";
import images from "../../images";

interface FilterProps {
  closeFilter: () => void;
}

const { Option } = Select;

const Filter: React.FC<FilterProps> = ({ closeFilter }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    const values = form.getFieldsValue();
    console.log(values);
    closeFilter();
  };

  return (
    <Modal
      open={true}
      onCancel={closeFilter}
      footer={null}
      title={<div className="flex items-center justify-between"><span>Filtr</span><Button type="text" onClick={closeFilter} icon={<img width={24} src={images.x_icon} alt="close" />} /></div>}
      className="filter-modal"
      closable={false}
    >
      <Form form={form} layout="vertical" className="space-y-2">
        <Form.Item name="birthDate" label="Tug'ilgan sana">
          <DatePicker className="w-full" picker="year" placeholder="Yilni tanlang" />
        </Form.Item>
        <Form.Item name="gender" label="Jinsi">
          <Select placeholder="Jinsni tanlang">
            <Option value="Erkak">Erkak</Option>
            <Option value="Ayol">Ayol</Option>
          </Select>
        </Form.Item>
        <Form.Item name="groupNumber" label="Guruh raqami">
          <Select placeholder="Guruh raqamini tanlang">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Davomat">
          <Form.Item name="attendanceYes" valuePropName="checked" noStyle>
            <Checkbox>Ha</Checkbox>
          </Form.Item>
          <Form.Item name="attendanceNo" valuePropName="checked" noStyle>
            <Checkbox className="ml-4">Yo'q</Checkbox>
          </Form.Item>
        </Form.Item>
      </Form>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={closeFilter}>Bekor qilish</Button>
        <Button type="primary" onClick={handleSave} icon={<img width={24} src={images.success} alt="save" />}>Saqlash</Button>
      </div>
    </Modal>
  );
};

export default Filter;
