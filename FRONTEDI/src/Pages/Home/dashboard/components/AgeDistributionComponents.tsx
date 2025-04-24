import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import DonutChart from "./AgeDistributionChart";
type AgeDistributionProps = {
  ageStats: { [key: string]: number } | undefined;
};
const AgeDistributionComponents = ({ ageStats }: AgeDistributionProps) => {
  return (
    <Col
      style={{
        background: "var(--oq-rang-1)",
        border: "1px solid var(--qidiruv-tizimi-1)",
        borderRadius: "4px",
        width: "48.9%",
      }}
    >
      <Row
        style={{
          padding: "20px 20px 10px 20px",
          borderBottom: "2px solid  var(--qidiruv-tizimi-1)",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          level={2}
          style={{
            fontWeight: 400,
            fontSize: "26px",
            color: "var(--matn-rang-1)",
            margin: 0,
            maxWidth: "160px",
            fontFamily: "var(--font-family)",
          }}
        >
          {" "}
          Bugun kelgan bolalar soni:
        </Title>
        <Title
          level={2}
          style={{
            fontWeight: 500,
            fontSize: "50px",
            color: "var(--breand-rang-1)",
            margin: 0,
            fontFamily: "var(--font-family)",
          }}
        >
          100%
        </Title>
      </Row>
      <Col style={{ padding: " 40px 35px 0px 40px" }}>
        {ageStats ? <DonutChart ageStats={ageStats} /> : ""}
      </Col>
    </Col>
  );
};

export default AgeDistributionComponents;
