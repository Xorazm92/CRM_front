import { Col, Typography } from "antd";
import icons from "../icons";

const { Title } = Typography;

// Demo data
const dataSource = [
  { fullname: "Ali Valiyev", time: "08:30", avatar: icons.user },
  { fullname: "Dilnoza Karimova", time: "08:45", avatar: icons.user },
  { fullname: "Sardor Qodirov", time: "09:00", avatar: icons.user },
];

const TodayArrivedStudentsCard = ({ fullname, time, avatar }: any) => (
  <Col style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f8f8", borderRadius: 6, padding: "10px 12px" }}>
    <img src={avatar} alt={fullname} style={{ width: 38, height: 38, borderRadius: "50%" }} />
    <Title level={5} style={{ margin: 0 }}>{fullname}</Title>
    <span style={{ marginLeft: "auto", color: "#888" }}>{time}</span>
  </Col>
);

const TodayArrivedStudentsComponents = () => {
  return (
    <Col style={{ padding: 20, background: "#fff", borderRadius: 8, minWidth: 260, flex: 1 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Bugun kelganlar</Title>
      {dataSource.map((item, idx) => (
        <TodayArrivedStudentsCard key={idx} {...item} />
      ))}
    </Col>
  );
};

export default TodayArrivedStudentsComponents;
