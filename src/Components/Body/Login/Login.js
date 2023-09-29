import React, { useContext, useState } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Button, Alert, Form, Input, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
import { Data } from "../Body";
import "./LoginStyle.css";

export const Login = () => {
  const { Title } = Typography;
  // User -> user.name, email, picture, id
  const { user, setUser } = useContext(Data);

  // Email check
  const fptEmail = "@fpt.edu.vn",
    feEmail = "@fe.edu.vn";
  const [checkMailErr, setCheckMailErr] = useState(false);

  //Handle login by gmail
  const login = useGoogleLogin({
    // Succes
    onSuccess: (codeResponse) =>
      // Fetch User data
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          //! validate @fpt.edu.vn and @fe.edu.vn
          if (
            res.data.email.includes(fptEmail) ||
            res.data.email.includes(feEmail)
          ) {
            setCheckMailErr(false);
            setUser(res.data);
          } else {
            setCheckMailErr(true);
          }
          //! call database, if database does not exist -> add data to database (default role: student)
          //! If user exists, get role
          //! Save to local storage
        })
        .catch((err) => console.log(err))
        .finally(() => {}),
    // error
    onError: (error) => console.log("Login Failed:", error),
  });

  // Handle login by username & password
  const handleLoginByUsernameFinish = (data) => {
    console.log(data);
  };
  return (
    <div className="backgroundLogin">
      <svg className="curvessLoginUpper"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffc77d" fill-opacity="1" d="M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,234.7C672,245,768,235,864,213.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

      <Form className="loginForm" onFinish={handleLoginByUsernameFinish}>
        <Title className="loginTitle" level={3}>
          Login Form
        </Title>
        <Form.Item
          name="username"
          label="Username"
          className="input"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          className="input"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button className="loginBtn" type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>

        {/* signin with google */}
        <Button
          style={Object.assign({ width: "100%" }, { margin: "0 0 10px 0" }, {height: "40px"})}
          icon={<GoogleOutlined />}
          onClick={login}
        >
          Sign in with Google
        </Button>
        {checkMailErr && (
          <Alert
            message="Your email doesn't have permission to sign in!"
            type="error"
            banner
          />
        )}
      </Form>

      <svg
        className="curvesLogin"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#ffc77d"
          fill-opacity="1"
          d="M0,32L48,64C96,96,192,160,288,170.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};
