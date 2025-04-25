import { Col, Row } from "antd";
//@ts-ignore
import CalendarIcon from "@/assets/svg/calendar-icon.svg";
import Title from "antd/es/typography/Title";

interface IStatistikaCard {
  icon: string | undefined;
  title: string | undefined;
  price?: number | undefined;
  procent: number | undefined;
  studentCount?: number | undefined;
}

export const StatistikaCard = ({
  icon,
  title,
  price,
  procent,
  studentCount,
}: IStatistikaCard) => {
  return (
    <Col
      style={{
        padding: "15px",
        boxShadow: " 2px 2px 4px 0 rgba(0, 0, 0, 0.1)",
        background: "var(--oq-rang-1)",
        border: " 1px solid var(--qidiruv-tizimi-1)",
        borderRadius: "4px",
        width: "full",
      }}
    >
      <Col
        style={{
          border: "1px solid var(--qidiruv-tizimi-1)",
          borderRadius: "4px",
          padding: "5px 8px 4px 8px",
          width: "50px",
          marginBottom: "5px",
        }}
      >
        <img width={32} height={32} src={icon} alt="" />
      </Col>
      <Title
        level={3}
        style={{
          fontWeight: 500,
          fontSize: "16px",
          color: "var(--matn-rang-1)",
          fontFamily: "var(--font-family)",
          margin: 0,
        }}
      >
        {" "}
        {title}
      </Title>
      <Title
        level={3}
        style={{
          fontWeight: 500,
          fontSize: "26px",
          color: "var(--matn-rang-1)",
          fontFamily: "var(--font-family)",
          margin: 0,
          marginTop: "10px",
        }}
      >
        {" "}
        {title === "Bolalar soni"
          ? `${studentCount ?? 0} ta`
          : `${price?.toString()?.toLocaleLowerCase() ?? 0} so’m`}
      </Title>

      <Row style={{ alignItems: "center", gap: "5px", marginTop: "20px" }}>
        <img src={CalendarIcon} alt="" />
        <Title
          level={3}
          style={{
            fontWeight: 400,
            fontSize: "16px",
            color: "var(--matn-rang-1)",
            fontFamily: "var(--font-family)",
            lineHeight: "130%",
            margin: 0,
          }}
        >
          {" "}
          Kechagi kunga nisbatan{" "}
          <span
            style={{
              fontWeight: 600,
              color: procent
                ? procent < 0
                  ? "var(--qizil-rang-1)"
                  : "var(--breand-rang-2)"
                : "",
            }}
          >
            {procent ?? 0}%
          </span>
        </Title>
      </Row>
    </Col>
  );
};
