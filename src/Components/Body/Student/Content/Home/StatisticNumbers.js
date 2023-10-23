import {React, useEffect, useContext, useState} from "react";
import { Card, Col, Row, Statistic } from "antd";
import {TeamOutlined, HourglassOutlined, SnippetsOutlined, MessageOutlined} from "@ant-design/icons"
import axios from "axios";
import { Data } from "../../../Body";

export const StatisticNumber = () => {
  const {user} = useContext(Data)
  const [statisticNum, setStatisticNum] = useState([])
  const [loading, setLoading] = useState(false)
  const getData = () => {
    setLoading(true)
    axios.get(`https://meet-production-52c7.up.railway.app/api/v1/student/indicator/${user.id}`)
    .then((res) => (setStatisticNum(res.data)))
    .catch((err) => (console.error(err)))
    .finally(() => (setLoading(false)))
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    // xs={} sm={} md={} xl={}
    <Row className="lecturerStatisticNumber">
      {/* Total Slot */}
      <Col xs={12} md={5} >
        <Card className="cardStatisticNumber">
          <Statistic prefix={<TeamOutlined />} title="Total Meetings" value={loading ? "-" : statisticNum.totalMeeting} />
        </Card>
      </Col>

      {/* Total Hours */}
      <Col xs={12} md={5}>
        <Card className="cardStatisticNumber">
          <Statistic prefix={<HourglassOutlined />} title="Meeting time" value={loading ? "-" : statisticNum.totalHours === null ? "0" : statisticNum.totalHours} />
        </Card>
      </Col>

      {/* Total Locations */}
      <Col xs={12} md={5}>
        <Card className="cardStatisticNumber">
          <Statistic prefix={<SnippetsOutlined />} title="Total Bookings" value={loading ? "-" : statisticNum.totalBookings} />
        </Card>
      </Col>

      {/* Most meeting subject */}
      <Col xs={12} md={5}>
        <Card className="cardStatisticNumber">
          <Statistic prefix={<MessageOutlined />} title="Most Discuss" value={loading ? "-" : statisticNum.mostDiscussSubject === null ? "-" : statisticNum.mostDiscussSubject} />
        </Card>
      </Col>
    </Row>
  );
};
