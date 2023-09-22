import "./Lecturer.css";
import { useContext } from "react";
import { Data } from "../Body";
import { LecturerMenu } from "./LecturerMenu";
import { LecturerCreateSlotBtn } from "./LecturerCreateSlotBtn";
import { Calendar} from "antd";

export const LecturerSider = () => {
  //get function set selected date
  const { setSelectedDate } = useContext(Data);

  //function run when change year/month
  const onPanelChange = (value, mode) => {
    // console.log(value.format("YYYY-MM-DD"), mode);
  };

  //function run when change date
  const onDateChange = (newDate) => {
    setSelectedDate(`${newDate.$D}/${newDate.$M + 1}/${newDate.$y}`);
  };

  return (
    <div className="Sider">
      {/* Create Button */}
      <LecturerCreateSlotBtn />
      {/* Calender */}
      <Calendar
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={onDateChange}
      />
      {/* Menu */}
      <LecturerMenu />
    </div>
  );
};
