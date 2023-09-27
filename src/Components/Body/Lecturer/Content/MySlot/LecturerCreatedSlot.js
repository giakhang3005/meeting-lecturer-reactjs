import { useContext, useState } from "react";
import { Data } from "../../../Body";
import { LecturerCreateSlotBtn } from "./LecturerCreateSlotBtn";
import { LectuerCalenderView } from "./CreatedSlotCalenderView";
import { CreatedSlotTableView } from "./CreatedSlotTableView";
import "../../Lecturer.css";
import { EditingSlot } from "./EditingSlot";
import { Typography, Tabs } from "antd";

export const LecturerCreatedSlot = () => {
  // Get state
  const { selectedDate, setSelectedDate, selectedWeek, setSelectedWeek } =
    useContext(Data);
  const { Title, Text } = Typography;

  //Slot view
  const [createdSlotView, setCreatedSlotView] = useState("");
  
  //slot is being edit
  const [editingSlot, setEditingSlot] = useState([]);

  //Tab of Views
  const tabsObj = [
    {
      label: "Calender View",
      key: "calenderView",
      children: (
        <LectuerCalenderView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          setCreatedSlotView={setCreatedSlotView}
          setEditingSlot={setEditingSlot}
        />
      ),
    },
    {
      label: "Table View",
      key: "tableView",
      children: (
        <CreatedSlotTableView setCreatedSlotView={setCreatedSlotView} setEditingSlot={setEditingSlot}/>
      ),
    },
  ];

  return (
    <div>
      {createdSlotView == "edit" ? (
        <EditingSlot editingSlot={editingSlot} setCreatedSlotView={setCreatedSlotView} />
      ) : (
        <>
          {/* Title */}
          <Title className="sectionTitle" level={3}>
            MY SLOTS <LecturerCreateSlotBtn />
          </Title>

          {/* Tabs */}
          <div className="createdSlotTabs">
            <Tabs defaultActiveKey="1" items={tabsObj} />
          </div>
        </>
      )}
    </div>
  );
};
