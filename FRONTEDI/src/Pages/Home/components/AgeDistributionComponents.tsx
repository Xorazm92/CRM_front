import { Card, Typography } from "antd";

const { Title } = Typography;

// Demo chart (replace with real chart lib if needed)
const DonutChart = ({ ageStats }: { ageStats?: any }) => (
  <div style={{ width: 160, height: 160, borderRadius: "50%", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ color: "#bbb" }}>Chart</span>
  </div>
);

const AgeDistributionComponents = ({ ageStats }: { ageStats?: any }) => {
  return (
    <Card style={{ borderRadius: 8, minWidth: 260, flex: 1 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Yosh taqsimoti</Title>
      <DonutChart ageStats={ageStats} />
    </Card>
  );
};

export default AgeDistributionComponents;
