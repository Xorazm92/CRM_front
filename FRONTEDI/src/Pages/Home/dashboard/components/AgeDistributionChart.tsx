import { Col, Row } from "antd";
import { FC } from "react";

const colors = [
  "#3AAFA9", // 0-1
  "#2C7873", // 1-2
  "#76D7C4", // 2-3
  "#A2DED0", // 3-4
  "#E5E8E8", // 4-5
  "#E74C3C", // 5-6
  "#AED6F1", // 6-7
];
interface DonutChartProps {
  ageStats: Record<string, number>;
}
const faykData = [
  { label: "0-1", value: 40 },
  { label: "1-2", value: 24 },
  { label: "2-3", value: 12 },
  { label: "3-4", value: 10 },
  { label: "4-5", value: 8 },
  { label: "5-6", value: 4 },
  { label: "6-7", value: 2 },
];

const DonutChart: FC<DonutChartProps> = ({ ageStats }) => {
    let data = Object.entries(ageStats).map(([label, value]) => ({
      label,
      value,
    }));
  // let data = faykData;
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  if (total === 0) {
    data = faykData;
  }

  return (
    <Row style={{ alignItems: "center" }}>
      {/* Chart */}
      <Col>
        <svg width={200} height={200}>
          <circle cx={100} cy={100} r={60} fill="#fff" />
          {(() => {
            let startAngle = 0;
            return data.map((item, index) => {
              const angle = (item.value / total) * 2 * Math.PI;
              const x1 = 100 + 80 * Math.cos(startAngle);
              const y1 = 100 + 80 * Math.sin(startAngle);
              const x2 = 100 + 80 * Math.cos(startAngle + angle);
              const y2 = 100 + 80 * Math.sin(startAngle + angle);
              const largeArcFlag = angle > Math.PI ? 1 : 0;
              const d = `
                M 100 100
                L ${x1} ${y1}
                A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              const path = (
                <path
                  key={index}
                  d={d}
                  fill={colors[index]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
              startAngle += angle;
              return path;
            });
          })()}
          <circle cx={100} cy={100} r={45} fill="white" />
        </svg>
      </Col>
      <Col style={{ marginLeft: "51px" }}>
        {data.map((item, index) => (
          <Row
            key={index}
            style={{ alignItems: "center", marginBottom: "6px" }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: colors[index],
                marginRight: 8,
                borderRadius: 2,
              }}
            />
            <span style={{ marginRight: 10 }}>{item.label}</span>
            <span style={{ fontWeight: "bold" }}>{item.value}%</span>
          </Row>
        ))}
      </Col>
    </Row>
  );
};

export default DonutChart;
