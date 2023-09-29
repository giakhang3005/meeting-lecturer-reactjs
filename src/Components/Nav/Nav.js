import { UserOutlined } from "@ant-design/icons";
import { Typography, Avatar } from "antd";
import "./NavStyle.css";

const { Text, Title } = Typography;
export const Nav = (props) => {
  //user
  const user = props.user,
    setUser = props.setUser;

  return (
    <div className="Nav">
      <Title level={5} className="logo">
        {/* Logo */}
        MEETING MY LECTURERS
      </Title>

      {/* User */}
      <div className="User">
        <Text className="Name">{user?.name}</Text>
        {/* <UserOutlined className="Icon" /> */}
        {user !== null && <Avatar src={user?.picture}></Avatar>}
      </div>
    </div>
  );
};