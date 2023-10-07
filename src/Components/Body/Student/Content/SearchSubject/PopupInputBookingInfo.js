import {React, useState} from "react";
import { Form, Typography, Input, Button, message } from "antd";
import { BookingSuccess } from "./ResultDisplay";

export function PopupInputPassword(props) {
  const isSelectedSlot = props.isSelectedSlot,
    setIsSelectedSlot = props.setIsSelectedSlot;

  const { Title } = Typography;

  //set form values
  const formValues = {
    ["id"]: isSelectedSlot.id,
    ["subject"]: isSelectedSlot.subject,
    ["lecturer"]: isSelectedSlot.lecturer,
    ["date"]: isSelectedSlot.date,
    ["startTime"]: isSelectedSlot.startTime,
    ["endTime"]: isSelectedSlot.endTime,
  };

  const handleCancel = () => {
    setIsSelectedSlot([]);
  };
  
  const handleSubmit = (data) => {
    if (isSelectedSlot.password === null) {
      const result = {
        slotId: isSelectedSlot.id,
        note: data.note === undefined ? null : data.note,
        //! Add student
        student: null,
      };
      //TODO: For Backend
      //! Place API here

      console.log(JSON.stringify(result));
      BookingSuccess(data);
      setIsSelectedSlot([]);
    } else {
      if (data.password === isSelectedSlot.password) {
        const result = {
          slotId: isSelectedSlot.id,
          note: data.note === undefined ? null : data.note,
          //! Add student
          student: null,
        };

        //TODO: For Backend
        //! Place API here

        console.log(JSON.stringify(result));
        BookingSuccess(data);
        setIsSelectedSlot([]);
      } else {
        message.error("Password does not match");
      }
    }
  };
  
    //submit antispam
    const [clickSubmit, setClickSubmit] = useState(0);
    //cooldown 3s if users click over 2 times
    setTimeout(() => {
      clickSubmit > 0 && setClickSubmit(clickSubmit - 1);
    }, 3000);
    //checker
    const handleSubmitAntispam = (data) => {
      clickSubmit === 2 && message.error('Please try again in 3 seconds');
      clickSubmit < 3 && setClickSubmit(clickSubmit + 1);
      if (clickSubmit < 2) {
        handleSubmit(data);
      }
    };
  return (
    <>
      <Title className="sectionTitle" level={3}>
        BOOKING
      </Title>
      
      <div className="editLocationForm">
        <Form initialValues={formValues} onFinish={handleSubmitAntispam}>
          {/* ID */}
          <Form.Item name="id" label="ID" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          {/* Lecturer */}
          <Form.Item
            name="lecturer"
            label="Lecturer"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          {/* Date */}
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <Input disabled />

            {/* Start Time */}
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          {/* End Time */}
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          {/* Input Password */}
          {/* Show password section if this slot have password */}
          {isSelectedSlot.password !== null && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: isSelectedSlot.password !== null,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          {/* Note */}
          <Form.Item name="note" label="Note" rules={[{ required: false }]}>
            <Input />
          </Form.Item>

          {/* Cancel */}
          <Form.Item>
            <Button
              onClick={handleCancel}
              style={{ margin: "0 8px 0 0" }}
              type="default"
              danger
            >
              Cancel
            </Button>
            {/* Save */}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
