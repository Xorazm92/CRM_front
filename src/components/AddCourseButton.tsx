import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
}

const AddCourseButton: React.FC<Props> = ({ onClick, children }) => (
  <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
    {children || "Yangi kurs"}
  </Button>
);

export default AddCourseButton;
