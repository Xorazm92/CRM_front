import { formatPhoneNumber } from "@/utils/format/format.phone.nuber";
import { Avatar, Row, Tag } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";

export interface IUserCard {
  id: number;
  avatar: string;
  fullname: string;
  birthDate: string;
  phoneNumber: string;
  address: string;
  gender: string;
}

export const UserCard = ({
  id,
  avatar,
  fullname,
  birthDate,
  gender,
  phoneNumber,
  address,
}: IUserCard) => {
  const phone = formatPhoneNumber(phoneNumber);

  return (
    <Row
      style={{
        boxShadow: " 2px 2px 4px 0 rgba(0, 0, 0, 0.1)",
        background: "var(--oq-rang-1)",
        border: " 1px solid var(--qidiruv-tizimi-1)",
        borderRadius: "4px",
        padding: "15px",
      }}
    >
      <Row style={{ alignItems: "center", gap: "50px" }}>
        <Row style={{ alignItems: "center", gap: "15px" }}>
          {" "}
          <Title
            level={2}
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
            }}
          >
            {id}
          </Title>
          <Avatar src={avatar} />
          <Title
            level={2}
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
              width: "230px",
              overflow: "hidden",
            }}
          >
            {fullname}
          </Title>{" "}
        </Row>
        <Row style={{ alignItems: "center", gap: "45px" }}>
          <Title
            level={2}
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
            }}
          >
            {dayjs(birthDate).format("DD-MM-YYYY")}
          </Title>
          <Row style={{ width: "69px" }}>
            <Tag color={gender === "MALE" ? "green" : "red"}>
              {gender === "MALE" ? "O’g’il bola" : "Qiz bola"}
            </Tag>
          </Row>
          <Title
            level={2}
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "var(--matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
            }}
          >
            {phone}
          </Title>
          <Title
            level={2}
            style={{
              fontWeight: 400,
              fontSize: "16px",
              maxWidth: "95px",
              color: "var(--matn-rang-1)",
              fontFamily: "var(--font-family)",
              margin: 0,
            }}
          >
            {address}
          </Title>
        </Row>
      </Row>
    </Row>
  );
};
