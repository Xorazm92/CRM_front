import React, { useState } from "react";
import { Modal, Button, Select, DatePicker, Checkbox, Form } from "antd";
import icons from "../../images/icons";

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
      title={<div className="filter-header"><span>Filtr</span><Button type="text" onClick={closeFilter} icon={<img width={24} src={icons.x_icon} alt="close" />} /></div>}
      className="filter-modal"
      closable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="birthDate" label="Tug'ilgan sana">
          <DatePicker className="filter-date-picker" picker="year" placeholder="Yilni tanlang" />
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
            <Checkbox className="filter-checkbox-gap">Yo'q</Checkbox>
          </Form.Item>
        </Form.Item>
      </Form>
      <div className="filter-footer">
        <Button onClick={closeFilter}>Bekor qilish</Button>
        <Button type="primary" onClick={handleSave} icon={<img width={24} src={icons.success} alt="save" />}>Saqlash</Button>
      </div>
    </Modal>
  );
};

export default Filter;
