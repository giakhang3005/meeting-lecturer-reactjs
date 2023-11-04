import { React, useState, useContext } from "react";
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  Checkbox,
  Radio,
} from "antd";
import { ConsoleSqlOutlined, FormOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Data } from "../../../Body";
import axios from "axios";

export function CreateSlotForm({
  isLoading,
  subjectsLoading,
  subjects,
  emails,
  locationsList,
  setCreatedSlotView,
  setIsLoading,
  getData,
}) {
  const { Title } = Typography;
  const { user } = useContext(Data);

  //push in to select format
  const pushSubjectList = (inputSubjects) => {
    const selectSubjects = inputSubjects.map((subject) => {
      return { value: subject.code, label: subject.code };
    });
    return selectSubjects;
  };

  //push in to select format
  const pushLocationList = (inputLocations) => {
    const selectLocations = inputLocations.map((loc) => {
      return { value: loc.id, label: loc.name };
    });
    return selectLocations;
  };

  //push in to select format
  const pushEmails = (emailsIn) => {
    const emailL = emailsIn.map((em) => {
      return { value: em, label: em };
    });
    return emailL;
  };

  //! STATE
  const [today, setToday] = useState(new dayjs());
  const [date, setDate] = useState(today);
  const [start, setStart] = useState(date.add(6, "hour"));
  const [end, setEnd] = useState(start.add(15, "minute"));
  const [mode, setMode] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [locationId, setLocationId] = useState(null);
  const [studentEmail, setStudentEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [type, setType] = useState("offline");

  //handle Date Change
  const handleDateChange = (newDate) => {
    if (newDate < today) {
      message.error("You can not create slot with date in the past");
    } else {
      setDate(newDate);
      //set new date/month/year for start time & end time
      setStart(
        newDate.date(newDate.date()).month(newDate.month()).year(newDate.year())
      );
      setEnd(
        newDate
          .date(newDate.date())
          .month(newDate.month())
          .year(newDate.year())
          .hour(end.hour())
          .minute(end.minute())
      );
    }
  };

  //handle State time change
  const handleStartChange = (newStart) => {
    if (newStart < today.add(6, "hour")) {
      message.error("You have to create slot at least 6 hours from now");
    } else {
      setStart(newStart);
      if (end.diff(newStart) < 900000) {
        setEnd(newStart.add(15, "minute"));
      }
    }
  };

  //handle End time change
  const handleEndChange = (newEnd) => {
    if (newEnd < start.add(15, "minute")) {
      message.error("Slot must be at least 15 minutes");
    } else {
      setEnd(newEnd);
    }
  };

  //handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    newMode == 2 && setStudentEmail(null);
  };

  //handle subject change
  const handleSubjectChange = (newSubjectList) => {
    setSelectedSubjects(newSubjectList);
  };

  //handle Location change
  const handleLocationChange = (newLoc) => {
    setLocationId(newLoc);
  };

  //handle Password change
  const handlePasswordChange = (e) => {
    if (e.target.value.indexOf(" ") === -1) {
      setPassword(e.target.value);
    } else {
      message.error("Password can not contain space");
    }
  };

  //handle type change
  const handleTypeChange = (newType) => {
    setType(newType);
  };

  //! handle submit
  const handleSubmit = () => {
    //conver time to string
    const dateString = `${date.$D < 10 ? `0${date.$D}` : date.$D}/${
      date.$M + 1 < 10 ? `0${date.$M + 1}` : date.$M + 1
    }/${date.$y}`;
    const startString = `${start.$H < 10 ? `0${start.$H}` : start.$H}:${
      start.$m < 10 ? `0${start.$m}` : start.$m
    }:00`;
    const endString = `${end.$H < 10 ? `0${end.$H}` : end.$H}:${
      end.$m < 10 ? `0${end.$m}` : end.$m
    }:00`;

    const returnSubjectsList = selectedSubjects.map((subject) => {
      return { subjectCode: subject };
    });
    const newSlot = {
      lecturerId: user.id,
      meetingDay: dateString,
      startTime: startString,
      endTime: endString,
      mode: mode,
      studentEmail: mode === 2 ? studentEmail : null,
      online: type === 'online',
      locationId: type === 'offline' ? locationId : null,
      slotSubjectDTOS: returnSubjectsList,
      password: !hasPassword ? null : password,
      // toggle: true,
      // status: true,
    };

    if (newSlot.mode === 2 && newSlot.studentEmail === null) {
      message.error("You can not let student email empty in Assign Mode");
    } else {
      //validation empty
      let locErr = false,
        SubjErr = false,
        passErr = false;
      (type === 'offline' && newSlot.locationId === null) && (locErr = true);
      newSlot.slotSubjectDTOS.length === 0 && (SubjErr = true);
      hasPassword &&
        (newSlot.password?.length === 0 || newSlot.password === null) &&
        (passErr = true);

      if (!SubjErr && !locErr && !passErr) {
        setIsLoading(true);
        console.log(JSON.stringify(newSlot));
        axios
          .post(
            "https://meet-production-52c7.up.railway.app/api/v1/slot",
            newSlot
          )
          .then((res) => {
            if (res.data.data === "error") {
              message.error(res.data.message);
            } else {
              message.success("Created successfully");
              getData();
              setCreatedSlotView("");
            }
          })
          .catch((err) => console.error(err))
          .finally(() => setIsLoading(false));
      } else {
        locErr && message.error("Location is required for Offline meeting");
        SubjErr && message.error("You must select at least 1 subject");
        passErr &&
          message.error(
            "You have enabled Passcode, please do not leave it empty"
          );
      }
    }
  };
  return (
    <>
      <Row className="requestsInfo">
        <Col xs={1}></Col>
        <Col xs={23}>
          {/* Date */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Date:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Title
                className="InfoText id"
                level={5}
                style={{ fontWeight: "400" }}
              >
                <DatePicker
                  style={{ width: "320px" }}
                  value={date}
                  format="DD/MM/YYYY"
                  onChange={(newDate) => handleDateChange(newDate)}
                />
              </Title>
            </Col>
          </Row>

          {/* Start */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Start:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Title
                className="InfoText id"
                level={5}
                style={{ fontWeight: "400" }}
              >
                <TimePicker
                  style={{ width: "320px" }}
                  format="HH:mm"
                  value={start}
                  onChange={(newStart) => handleStartChange(newStart)}
                />
              </Title>
            </Col>
          </Row>

          {/* End */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                End:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Title
                className="InfoText id"
                level={5}
                style={{ fontWeight: "400" }}
              >
                <TimePicker
                  style={{ width: "320px" }}
                  value={end}
                  format="HH:mm"
                  onChange={(newEnd) => handleEndChange(newEnd)}
                />
              </Title>
            </Col>
          </Row>

          {/* Mode */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Mode:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Title
                className="InfoText id"
                level={5}
                style={{ fontWeight: "400" }}
              >
                <Select
                  style={Object.assign({ width: "320px" })}
                  defaultValue={mode}
                  onChange={(newMode) => handleModeChange(newMode)}
                >
                  <Select.Option value={0}>Manual Approve</Select.Option>
                  <Select.Option value={1}>
                    Accept the first Booker
                  </Select.Option>
                  <Select.Option value={2}>Assign Student</Select.Option>
                </Select>
              </Title>
            </Col>
          </Row>

          {/* Student email */}
          {mode === 2 && (
            <Row className="animateBox">
              <Col xs={9} md={3}>
                <Title className="InfoText ID" level={5}>
                  Student Email:
                </Title>
              </Col>
              <Col xs={15} md={10}>
                <Title
                  className="InfoText id"
                  level={5}
                  style={{ fontWeight: "400" }}
                >
                  <Select
                    showSearch
                    style={Object.assign({ width: "320px" })}
                    options={pushEmails(emails)}
                    onChange={(newEmail) => setStudentEmail(newEmail)}
                  />
                </Title>
              </Col>
            </Row>
          )}

          {/* Type */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Type:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Title
                className="InfoText id"
                level={5}
                style={{ fontWeight: "400" }}
              >
                <Radio.Group
                  style={Object.assign({ width: "320px" })}
                  value={type}
                  onChange={(newType) => handleTypeChange(newType.target.value)}
                >
                  <Radio.Button value={"offline"}>Offline</Radio.Button>
                  <Radio.Button value={"online"}>Online</Radio.Button>
                </Radio.Group>
              </Title>
            </Col>
          </Row>

          {/* Location */}
          {type === "offline" && (
            <Row className="animateBox">
              <Col xs={9} md={3}>
                <Title className="InfoText ID" level={5}>
                  Location:
                </Title>
              </Col>
              <Col xs={15} md={10}>
                <Title
                  className="InfoText"
                  level={5}
                  style={{ fontWeight: "400" }}
                >
                  <Select
                    style={{ minWidth: "320px" }}
                    className="editInput"
                    options={pushLocationList(locationsList)}
                    onChange={(newLoc) => handleLocationChange(newLoc)}
                  ></Select>
                </Title>
              </Col>
            </Row>
          )}

          {/* Subject */}

          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Subjects:
              </Title>
            </Col>
            <Col xs={15} md={10}>
              <Spin spinning={subjectsLoading} tip="Preparing Subjects...">
                <Title
                  className="InfoText"
                  level={5}
                  style={{ fontWeight: "400" }}
                >
                  <Select
                    style={Object.assign(
                      { minWidth: "320px" },
                      { maxWidth: "320px" }
                    )}
                    mode="multiple"
                    className="editInput"
                    options={pushSubjectList(subjects)}
                    onChange={(subjectsList) =>
                      handleSubjectChange(subjectsList)
                    }
                  ></Select>
                </Title>
              </Spin>
            </Col>
          </Row>

          {/* Password */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText ID" level={5}>
                Passcode{" "}
                <span style={Object.assign({ fontSize: "9px" })}>
                  <Checkbox
                    checked={hasPassword}
                    onChange={() => setHasPassword(!hasPassword)}
                  ></Checkbox>
                </span>
              </Title>
            </Col>
            <Col xs={15} md={10} style={{ height: "25px" }}>
              <Title
                className="InfoText id"
                level={5}
                style={Object.assign(
                  { fontWeight: "400" },
                  { animation: "fade 0.2s ease-out" }
                )}
              >
                {hasPassword ? (
                  <Input
                    className="editInput animateBox"
                    style={{ width: "320px" }}
                    showCount
                    value={password}
                    onChange={(e) => handlePasswordChange(e)}
                  ></Input>
                ) : (
                  <i
                    className="animateBox"
                    style={Object.assign(
                      { fontSize: "11px" },
                      { color: "gray" }
                    )}
                  >
                    Tick the checkbox to enable Passcode
                  </i>
                )}
              </Title>
            </Col>
          </Row>

          {/* Buttons */}
          <Row className="animateBox">
            <Col xs={9} md={3}>
              <Title className="InfoText" level={5}></Title>
            </Col>
            <Col xs={15} md={10}>
              {/* Create */}
              <Button
                disabled={subjectsLoading || isLoading}
                type="primary"
                style={{ margin: "12px 8px 0 0" }}
                icon={<FormOutlined />}
                onClick={handleSubmit}
              >
                Create
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}