import { useContext } from "react";
import { Data } from "../../Body";
import { Menu } from "antd";
import {
  SearchOutlined,
  BellFilled,
  HomeFilled,
  TeamOutlined,
  HourglassFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useLogOut } from "../../../../Hooks/All/useLogout";

export const StudentMenu = () => {
  //Get data from app.js
  const { menuOpt, setMenuOpt } = useContext(Data);

  const LogOutBtn = useLogOut();

  //Item for menu
  const menuItems = [
    { label: "Home", icon: <HomeFilled />, key: "studentDashboard" },
    {
      label: "Slots",
      icon: <TeamOutlined />,
      key: null,
      children: [
        { label: "Find slots", icon: <SearchOutlined />, key: "subjectSearch" },
        { label: "Requests sent", icon: <BellFilled />, key: "sentRequests" },
      ],
      type: "group",
    },

    {
      label: "My Meetings",
      icon: <TeamOutlined />,
      key: null,
      children: [
        {
          label: "Upcomming",
          icon: <HourglassFilled />,
          key: "upcommingMeetings",
        },
        { label: "Past", icon: <ClockCircleFilled />, key: "pastMeetings" },
      ],
      type: "group",
    },
  ];
  //selectedKeys
  return (
    <>
      <Menu
        mode="inline"
        items={menuItems}
        defaultSelectedKeys="lecturerDashboard"
        selectedKeys={menuOpt}
        onClick={(selectedOpt) => {
          setMenuOpt(selectedOpt.key);
        }}
      />

      {/* Logout Btn */}
      <LogOutBtn />
    </>
  );
};