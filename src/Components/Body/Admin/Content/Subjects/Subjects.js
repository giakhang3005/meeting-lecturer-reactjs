import { React, useState, useEffect } from "react";
import { Typography, Table, Row, Col, Button, message, Tag } from "antd";
import {
  EditOutlined,
  PoweroffOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

export function Subjects({ setSubjectEdit, setMenuOpt }) {
  const { Title, Text } = Typography;
  const [otherLoading, setOtherLoading] = useState(false);

  //! Get
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    axios
      .get("https://meet-production-52c7.up.railway.app/api/subject")
      .then((response) => (setSubjects(response.data), setLoading(false)))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
  }, []);

  //! TOGGLE
  const handleToggle = (subject) => {
    setOtherLoading(true);
    const subSubject = {
      name: subject.name === null ? subject.id : subject.name,
      status: !subject.status
    }
    axios
      .put(
        `https://meet-production-52c7.up.railway.app/api/subject/status/${subject.id}`,
        subSubject
      )
      .then(() => {
        setOtherLoading(false);
        message.success("Toggled successfully");
        getData();
      })
      .catch(
        (err) => err.status === "BAD_REQUEST" && message.error("Toggled failed")
      );
  };

  // Handle Edit Click
  const handleEdit = (subject) => {
    setSubjectEdit(subject);
    setMenuOpt("editSubjects");
  };

  //table columns
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Code",
      dataIndex: "code",
    },
    {
      key: "3",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "4",
      title: "Status",
      render: (subject) => {
        return (
          <>
            {subject.status ? (
              <Tag color="green">Active</Tag>
            ) : (
              <Tag color="red">Disabled</Tag>
            )}
          </>
        );
      },
    },
    {},
    {
      key: "5",
      title: "Semester",
      dataIndex: "semester",
    },
    {
      key: "6",
      title: "Major",
      render: (subject) => {
        return subject.majorList.map((major, i) => {
          return <Tag key={i} color="orange">{major.majorName}</Tag>
        })
      },
    },
    {
      key: "7",
      label: "",
      render: (subject) => {
        return (
          <>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(subject)}
            ></Button>
            <Button
              onClick={() => handleToggle(subject)}
              type="text"
              style={subject.status ? { color: "green" } : { color: "red" }}
              icon={<PoweroffOutlined />}
            ></Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Title className="sectionTitle" level={3}>
        SUBJECTS
        <Button
          icon={<PlusOutlined />}
          onClick={() => setMenuOpt("addSubjects")}
          disabled={isLoading || otherLoading}
        >
          Add Subject
        </Button>
      </Title>
      {/* Table of result */}
      <Row style={{ overflow: "scroll" }}>
        <Col xs={24}>
          <Table
            className="tableOfLocations"
            columns={columns}
            dataSource={subjects}
            loading={isLoading || otherLoading}
            rowKey="id"
          ></Table>
        </Col>
      </Row>
    </>
  );
}