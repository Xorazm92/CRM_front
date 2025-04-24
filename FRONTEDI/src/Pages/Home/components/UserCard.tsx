import { Avatar, Row, Typography } from "antd";
import icons from "../icons";

interface UserCardProps {
  id: number;
  avatar?: string;
  fullname: string;
  birthDate?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
}

const { Title, Text } = Typography;

export const UserCard = ({
  id,
  avatar,
  fullname,
  birthDate,
  gender,
  phoneNumber,
  address,
}: UserCardProps) => {
  return (
    <Row style={{ alignItems: "center", gap: "15px", background: "#fff", padding: "10px 12px", borderRadius: 6 }}>
      <Text style={{ width: 30 }}>{id}</Text>
      <Avatar src={avatar || icons.user} size={44} />
      <Title level={5} style={{ margin: 0, minWidth: 140 }}>{fullname}</Title>
      <Text style={{ width: 110 }}>{birthDate || "-"}</Text>
      <Text style={{ width: 60 }}>{gender || "-"}</Text>
      <Text style={{ width: 110 }}>{phoneNumber || "-"}</Text>
      <Text style={{ width: 160 }}>{address || "-"}</Text>
    </Row>
  );
};
