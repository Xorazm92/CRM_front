import { Card, Row, Typography } from "antd";

interface StatistikaCardProps {
  title: string;
  icon: string;
  price?: number | string;
  procent?: number | string;
  studentCount?: number | string;
}

const { Title, Text } = Typography;

export const StatistikaCard = ({
  title,
  icon,
  price,
  procent,
  studentCount,
}: StatistikaCardProps) => {
  return (
    <Card style={{ borderRadius: 8, minHeight: 100 }}>
      <Row style={{ alignItems: "center", gap: 12 }}>
        <img src={icon} alt={title} style={{ width: 38, height: 38 }} />
        <div>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          {typeof price !== "undefined" && (
            <Title level={4} style={{ margin: 0 }}>{price} so'm</Title>
          )}
          {typeof studentCount !== "undefined" && (
            <Title level={4} style={{ margin: 0 }}>{studentCount} ta</Title>
          )}
          {typeof procent !== "undefined" && (
            <Text type={procent > 0 ? "success" : "danger"}>{procent}%</Text>
          )}
        </div>
      </Row>
    </Card>
  );
};
