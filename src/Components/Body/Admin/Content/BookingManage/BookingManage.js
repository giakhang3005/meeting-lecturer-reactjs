import { React, useState, useEffect } from "react";
import { Table, Typography, Popover, Tag } from "antd";
import axios from "axios";
import { useArray } from "../../../../../Hooks/All/useArray";
import { useStudentRequests } from "../../../../../Hooks/Student/useStudentRequests";

export function BookingManage() {
  const ArrayToString = useArray()
  const {Accept, Decline, Pending} = useStudentRequests()
  const { Title } = Typography;

  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    axios.get('https://meet-production-52c7.up.railway.app/api/booking')
    .then((response) => setBookingList(response.data))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Date",
      render: (booking) => {
        return <>{booking.slotInfo.meetingDate}</>
      }
    },
    {
      key: "3",
      title: "Start",
      render: (booking) => {
        return <>{booking.slotInfo.startTime}</>
      }
    },
    {
      key: "4",
      title: "End",
      render: (booking) => {
        return <>{booking.slotInfo.endTime}</>
      }
    },
    {
      key: "5",
      title: "Booker",
      render: (booking) => {
        return <>{booking.studentInfo.studentName}</>
      }
    },
    {
      key: "6",
      title: "Lecturer",
      render: (booking) => {
        return <>{booking.slotInfo.lecturerName}</>
      }
    },
    {
      key: "7",
      title: "Location",
      render: (booking) => {
        return (
          <Popover content={booking.slotInfo.locationAddress}>
            <Tag color="volcano">{booking.slotInfo.locationName}</Tag>
          </Popover>
        );
      },
    },
    {
      key: "8",
      title: "Subject",
      render: (booking) => {
        let subjectList = []
        booking.subjectSlot.map((subject) => {
          subjectList.push(subject.subjectCode)
        })

        return ArrayToString(subjectList)
      }
    },
    {
      key: "9",
      title: "Status",
      render: (booking) => {
        switch (booking.status) {
          case 0: return <Decline />;
          case 1: return <Pending />;
          case 2: return <Accept />;
        }
      }
    },
    {
      key: "10",
      title: "Note",
      dataIndex: "note",
    },
  ];
  return (
    <>
      <Title className="sectionTitle" level={3}>
        BOOKINGS
      </Title>
      <Table
        className="tableOfLocations"
        columns={columns}
        dataSource={bookingList}
        loading={loading}
        rowKey="id"
      ></Table>
    </>
  )
}