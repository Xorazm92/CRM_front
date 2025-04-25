import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { TodayArrivedStudentsCard } from "./TodayArrivedStudentsCard";
const dataSource = [
  {
    key: "1",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "2",
    name: "Nodirova Shodiya Tursinjon qizi",
    dob: "15.05.1996",
    gender: "female",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    key: "3",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "3",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "3",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "3",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "3",
    name: "Sultonov Shokirjon Tursinjon o’g’li",
    dob: "15.05.1996",
    gender: "male",
    contact: "+998 (93) 123-45-67",
    address: "Toshkent. Sentr",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

const TodayArrivedStudentsComponents = () => {
  return (
    <Col
      style={{
        background: "var(--oq-rang-1)",
        border: "1px solid var(--qidiruv-tizimi-1)",
        borderRadius: "4px",
        width: "49%",
      }}
    >
      <Row
        style={{
          padding: "20px 20px 10px 20px",
          borderBottom: "2px solid  var(--qidiruv-tizimi-1)",
          justifyContent: "space-between",
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
        <Col>
          <Row
            style={{
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Title
              level={2}
              style={{
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--matn-rang-1)",
                margin: 0,
                fontFamily: "var(--font-family)",
              }}
            >
              Sana:
            </Title>
            <Row
              style={{
                padding: "6px 20px",
                border: "1px solid var(--qidiruv-tizimi-1)",
                borderRadius: "4px",
                background: "var(--stroka-rang-2)",
              }}
            >
              <Title
                level={2}
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "var(--matn-rang-1)",
                  margin: 0,
                  fontFamily: "var(--font-family)",
                }}
              >
                11.05.2024
              </Title>
            </Row>
          </Row>
          <Title
            level={2}
            style={{
              fontWeight: 500,
              fontSize: "22px",
              color: "var(--breand-rang-1)",
              margin: 0,
              fontFamily: "var(--font-family)",
            }}
          >
            100 ta
          </Title>
        </Col>
      </Row>
      <Col
        style={{
          padding: "20px",
        }}
      >
        <Row style={{ gap: "233px", marginBottom: "10px" }}>
          <Row style={{ gap: "22px" }}>
            <Title
              level={4}
              style={{
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--filter-matn-rang-1)",
                fontFamily: "var(--font-family)",
                margin: 0,
              }}
            >
              {" "}
              #
            </Title>
            <Title
              level={4}
              style={{
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--filter-matn-rang-1)",
                fontFamily: "var(--font-family)",
                margin: 0,
              }}
            >
              {" "}
              Bolalar F.I.O
            </Title>
          </Row>
          <Title
            level={4}
            style={{
              fontWeight: 500,
              fontSize: "16px",
              color: "var(--filter-matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
            }}
          >
            {" "}
            Jinsi
          </Title>
        </Row>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "190px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "10px",
          }}
          className="custom-scroll"
        >
          {dataSource.map((items, index) => (
            <TodayArrivedStudentsCard
              id={index + 1}
              key={index}
              avatar={items.avatar}
              fullname={items.name}
              gender={items.gender}
            />
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default TodayArrivedStudentsComponents;
