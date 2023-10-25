import { Button, Table, message, Popover, Alert, Tag } from "antd";
import { LockFilled, UnlockFilled } from "@ant-design/icons";
import { useArray } from "../../../../../Hooks/All/useArray";
import { useState, useContext } from "react";
import axios from "axios";
import { Data } from "../../../Body";

export const ResultDisplay = (props) => {
  const setSlotView = props.setSlotView,
    setIsSelectedSlot = props.setIsSelectedSlot,
    isSearchingSubject = props.isSearchingSubject,
    startDate = props.startDate,
    toDate = props.toDate,
    recentSearch = props.recentSearch,
    BookingList = props.BookingList,
    loading = props.loading;

  const { user } = useContext(Data);

  //table variables
  const columns = [
    // {
    //   key: "1",
    //   title: "ID",
    //   //location.id
    //   dataIndex: "id",
    // },
    {
      key: "2",
      title: "Lecturer",
      dataIndex: "lecturerName",
    },
    {
      key: "3",
      title: "Date",
      dataIndex: "meetingDay",
    },
    {
      key: "4",
      title: "Start Time",
      render: (slot) => {
        return slot.startTime.slice(0, 5);
      },
    },
    {
      key: "5",
      title: "End Time",
      render: (slot) => {
        return slot.endTime.slice(0, 5);
      },
    },
    // {
    //   key: "3",
    //   title: "Status",
    //   render: (slot) => {
    //     return slot.status ? "true" : "false"
    //   }
    // },
    {
      key: "6",
      title: "Location",
      render: (booking) => {
        return (
          <Popover content={booking.locationAddress}>
            {" "}
            <Tag color="green">{booking.locationName}</Tag>
          </Popover>
        );
      },
    },
    {
      key: "7",
      title: "Subjects",
      render: (booking) => {
        return booking.slotSubjectDTOS.map((subj, i) => {
          return (
            <Tag color="volcano" key={i}>
              {subj.subjectCode}
            </Tag>
          );
        });
      },
    },

    {
      key: "8",
      title: "",
      render: (booking) => {
        return (
          <>
            {/* Slot does not have password */}
            {booking.password === null || booking.password === "" ? (
              <Popover content="Click to send a booking request!">
                <UnlockFilled
                  style={Object.assign(
                    { color: "green" },
                    { fontSize: "22px" },
                    { margin: "0 7px 0 0" }
                  )}
                  onClick={() => Book(booking)}
                />
              </Popover>
            ) : (
              // Slot have password
              <Popover content="This slot have a password, Click to enter password!">
                <LockFilled
                  style={Object.assign(
                    { color: "red" },
                    { fontSize: "22px" },
                    { margin: "0 7px 0 0" }
                  )}
                  onClick={() => Book(booking)}
                />
              </Popover>
            )}
          </>
        );
      },
    },
  ];

  //handle book action
  const [checkingLoading, setCheckingLoading] = useState(false)
  const Book = (booking) => {
    setCheckingLoading(true)
    axios
      .get(
        `https://meet-production-52c7.up.railway.app/api/booking/exists?studentId=${user.id}&slotId=${booking.id}`
      )
      .then((res) =>
        res.data.exists
          ? message.error(
              "You have booked this slot aldready, please check the 'Requests sent' category to view booking status!"
            )
          : setIsSelectedSlot(booking)
      )
      .catch((err) => console.error(err))
      .finally(() => setCheckingLoading(false))
  };

  return (
    <>
      {!loading &&
        (recentSearch.subject !== null ||
          recentSearch.start !== null ||
          recentSearch.to !== null) && (
          <Alert
            style={{ margin: "8px 0 0 0" }}
            message={`Found ${BookingList.length} slots for ${
              recentSearch.subject === null || recentSearch.subject === ""
                ? "All"
                : recentSearch.subject
            } ${
              recentSearch.start !== null
                ? `from ${recentSearch.start} to ${recentSearch.to}`
                : ""
            }`}
            type="info"
            showIcon
          />
        )}

      {/* Table of result */}
      <Table
        className="tableOfLocations"
        columns={columns}
        dataSource={BookingList}
        loading={loading || checkingLoading}
        rowKey="id"
        key="key"
        style={{ textAlign: "center" }}
      ></Table>
    </>
  );
};