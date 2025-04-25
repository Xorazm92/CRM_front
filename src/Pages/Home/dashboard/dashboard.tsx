import { Button, Col, Dropdown, MenuProps, Row, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
// @ts-ignore
import IncomeIcon from "@/assets/svg/Income.icon.svg";
// @ts-ignore
import OutecomeIcon from "@/assets/svg/outcome.icon.svg";
// @ts-ignore
import StudentCountIcon from "@/assets/svg/student.count.icon.svg";
import "./css/style.css";
// @ts-ignore
import CategoryMenuIcon from "@/assets/svg/menu.category.icon.svg";
import { UserCard } from "./components/UserCard";
import { StatistikaCard } from "./components/StatistikaCard";
import { useGetDashboard } from "./service/query/useGetDashboard";
import TodayArrivedStudentsComponents from "./components/TodayArrivedStudentsComponents";
import AgeDistributionComponents from "./components/AgeDistributionComponents";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Teachers
      </a>
    ),
  },
];

const Dashboard = () => {
  const [category, setCategory] = useState("Hamma");

  const { data, isLoading } = useGetDashboard(
    "",
    category === "Hamma"
      ? ""
      : category === "O’qituvchilar"
      ? "TEACHER"
      : category === "O’quvchilar"
      ? "STUDENT"
      : ""
  );
  return (
    <>
      <Col
        style={{
          padding: "22px 20px 20px 20px",
          borderBottom: "1px solid var(--qidiruv-tizimi-1)",
        }}
      >
        {" "}
        <Title
          level={2}
          style={{
            fontWeight: 600,
            fontSize: "26px",
            color: "var(--matn-rang-1)",
            fontFamily: "var(--font-family)",
            margin: 0,
          }}
        >
          {" "}
          Asosiy bo’lim
        </Title>
      </Col>
      <Col
        style={{
          padding: "40px 20px",
          fontFamily: "var(--font-family)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Row style={{ width: "full", gap: "25px" }}>
          <Col
            style={{
              background: "var(--oq-rang-1)",
              border: "1px solid var(--qidiruv-tizimi-1)",
              borderRadius: "4px",
              width: "76%",
            }}
          >
            <Row
              justify={"space-between"}
              style={{
                padding: "20px",
                borderBottom: "2px solid  var(--qidiruv-tizimi-1)",
              }}
            >
              <Title
                level={2}
                style={{
                  fontWeight: 400,
                  fontSize: "26px",
                  color: "var(--matn-rang-1)",
                  fontFamily: "var(--font-family)",
                  margin: 0,
                }}
              >
                {" "}
                O’qituvchilar soni:{" "}
                <span
                  style={{
                    fontSize: "22px",
                    color: "var(--breand-rang-1)",
                  }}
                >
                  {data?.data?.studentCount}
                </span>
              </Title>

              <Row style={{ gap: "15px" }}>
                <Dropdown menu={{ items }} placement="bottom">
                  <Button style={{ padding: "0px 5px" }}>
                    <img
                      src={CategoryMenuIcon}
                      style={{ width: "24px", height: "24px" }}
                      alt=""
                    />
                  </Button>
                </Dropdown>

                {["Hamma", "O’qituvchilar", "O’quvchilar"].map(
                  (item, index) => (
                    <Button
                      key={index}
                      onClick={() => setCategory(item)}
                      style={{
                        fontWeight: 500,
                        padding: "0px 20px",
                        fontSize: "16px",
                        color:
                          category === item
                            ? "var(--breand-rang-2)"
                            : "var(--matn-rang-1)",
                        boxShadow:
                          category === item
                            ? "2px 2px 2px 0 rgba(0, 0, 0, 0.1)"
                            : "none",
                        background: "var(--stroka-rang-2)",
                      }}
                    >
                      {item}
                    </Button>
                  )
                )}
              </Row>
            </Row>
            <Row
              style={{
                flexDirection: "column",
                padding: "0px  20px",
              }}
            >
              <Row
                style={{
                  background: "var(--oq-rang-1)",
                  borderRadius: "4px",
                  padding: "20px 15px",
                  gap: "38px",
                }}
              >
                <Row style={{ gap: "20px", width: "300px" }}>
                  {["#", "O’qituvchilar F.I.O"].map((item, index) => (
                    <Title
                      key={index}
                      level={2}
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "var(--filter-matn-rang-1)",
                        fontFamily: "var(--font-family)",
                        margin: 0,
                      }}
                    >
                      {item}
                    </Title>
                  ))}
                </Row>
                <Row style={{ gap: "99px" }}>
                  <Row style={{ gap: "48px" }}>
                    {["Tug’ilgan sana", "Jinsi"].map((item, index) => (
                      <Title
                        key={index}
                        level={2}
                        style={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "var(--filter-matn-rang-1)",
                          fontFamily: "var(--font-family)",
                          margin: 0,
                        }}
                      >
                        {item}
                      </Title>
                    ))}
                  </Row>
                  <Row style={{ gap: "88px" }}>
                    {["Kontakt", "Yashash manzil"].map((item, index) => (
                      <Title
                        key={index}
                        level={2}
                        style={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "var(--filter-matn-rang-1)",
                          fontFamily: "var(--font-family)",
                          margin: 0,
                        }}
                      >
                        {item}
                      </Title>
                    ))}
                  </Row>
                </Row>
              </Row>
              {isLoading ? (
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "225px",
                  }}
                >
                  <Spin />
                </Col>
              ) : (
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    height: "225px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    paddingRight: "10px",
                  }}
                  className="custom-scroll"
                >
                  {data?.data?.users?.map((items, index) => (
                    <UserCard
                      key={items.user_id}
                      id={index + 1}
                      avatar={items?.images[0]?.url}
                      fullname={items?.full_name}
                      birthDate={items?.data_of_birth}
                      gender={items?.gender}
                      phoneNumber={items?.phone_number}
                      address={items?.address}
                    />
                  ))}
                </Col>
              )}
            </Row>
          </Col>
          <Col
            style={{
              width: "22%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <StatistikaCard
              title={"Kirimlar"}
              icon={IncomeIcon}
              price={data?.data?.income?.sum}
              procent={data?.data?.income?.percent}
            />
            <StatistikaCard
              title={"Chiqimlar"}
              icon={OutecomeIcon}
              price={data?.data?.cost?.sum}
              procent={data?.data?.cost?.percent}
            />
          </Col>
        </Row>
        <Row style={{ width: "full", gap: "25px" }}>
          <Row style={{ gap: "20px", width: "76%" }}>
            <TodayArrivedStudentsComponents />
            <AgeDistributionComponents ageStats={data?.data?.ageStats} />
          </Row>
          <Col
            style={{
              width: "22%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <StatistikaCard
              title={"Bolalar soni"}
              icon={StudentCountIcon}
              studentCount={data?.data?.studentCount}
              procent={30}
            />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Dashboard;
