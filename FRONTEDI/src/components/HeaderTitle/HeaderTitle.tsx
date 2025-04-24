import React from "react";
import { Select, Typography, Row, Col } from "antd";

const { Title } = Typography;

const HeaderTitle: React.FC = () => {
  return (
    <Row align="middle" justify="space-between" className="mb-4">
      <Col>
        <Title level={3} className="!mb-0">CRM Boshqaruv Paneli</Title>
      </Col>
      <Col>
        <Select defaultValue="UZB" style={{ width: 100 }}>
          <Select.Option value="UZB">UZB</Select.Option>
          <Select.Option value="ENG">ENG</Select.Option>
          <Select.Option value="RUS">RUS</Select.Option>
        </Select>
      </Col>
    </Row>
  );
};

export default HeaderTitle;
