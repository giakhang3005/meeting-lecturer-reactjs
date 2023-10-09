import React, { useContext, useState, useCallback } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Button, Alert, Form, Input, Typography, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
import { Data } from "../Body";
import "./LoginStyle.css";

export const Login = () => {

  const { Title } = Typography;
  // User -> user.name, email, picture, id, role...
  const { user, setUser, setRole } = useContext(Data);
  const { isErr, setIsErr } = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email check
  const fptEmail = "@fpt.edu.vn",
    feEmail = "@fe.edu.vn";
  const [checkMailErr, setCheckMailErr] = useState(false);

  //Handle login by gmail
  const loginWithGG = useGoogleLogin({
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
            const userFromGg = res.data;
            //! call database, if database does not exist -> add data to database (default role: student)
            // console.log(userFromGg)
            // axios.get(`https://meet-production-52c7.up.railway.app/api/v1/user/get/${userFromGg.id}`).then(fetchRes => console.log(fetchRes))
            //! If user (check by email) exists, get role 
            const role = "student"; //this role fetch from DB

            // Login successfully
            //user with role
            const finalUser = { ...userFromGg, role };

            // Set Internal state
            setUser(finalUser);
            setRole(role);

            //encode user
            const encodedUser = btoa(JSON.stringify(finalUser));
            //! Save to session storage
            sessionStorage.setItem("user", encodedUser);
          } else {
            setCheckMailErr(true);
          }
        })
        .catch((err) => {
          setIsErr(true);
          console.log(err);
        })
        .finally(() => {
          // setIsLoading(false)
        }),
    // error
    onError: (error) => {
      setIsErr(true);
      // setIsLoading(false)
      console.log("Login Failed:", error);
    },
  });

  const handleSignin = () => {
    // setIsLoading(true)
    loginWithGG();
  };

  // Handle login by username & password
  const handleLoginByUsernameFinish = (data) => {
    //test lecturer account
    const lecturerTestAccount = {
      id: "lecturer@test",
      password: "test@123",
      role: "lecturer",
      name: "Test Lecturer Account",
    };
    const adminTestAccount = {
      id: "admin@test",
      password: "test@123",
      role: "admin",
      name: "Test Admin Account",
    };

    if (
      (data.userId === lecturerTestAccount.id &&
        data.password === lecturerTestAccount.password) ||
      (data.userId === adminTestAccount.id &&
        data.password === adminTestAccount.password)
    ) {
      //!Get full user from DB using data.username & data.password
      let FinalUser = {};
      data.userId === lecturerTestAccount.id
        ? (FinalUser = { ...lecturerTestAccount })
        : (FinalUser = { ...adminTestAccount });

      // Set Internal state
      setUser(FinalUser);
      setRole(FinalUser.role);

      //encode user
      const encodedUser = btoa(JSON.stringify(FinalUser));
      //! Save to session storage
      sessionStorage.setItem("user", encodedUser);
    } else {
      message.error("Invalid username or password!");
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
    clickSubmit === 2 && message.error("Please try again in 3 seconds");
    clickSubmit < 3 && setClickSubmit(clickSubmit + 1);
    if (clickSubmit < 2) {
        handleLoginByUsernameFinish(data);
    }
  };

  return (
      <div className="backgroundLogin">

        <Form className="loginForm" onFinish={handleSubmitAntispam}>
          <Title className="loginTitle" level={3}>
            Login Form
          </Title>
          <Form.Item
            name="userId"
            label="UserID"
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
            style={Object.assign(
              { width: "100%" },
              { margin: "0 0 10px 0" },
              { height: "40px" }
            )}
            loading={isLoading}
            icon={<GoogleOutlined />}
            onClick={() => handleSignin()}
          >
            Sign in with Google
          </Button>
          {/* Email notification */}
          {checkMailErr && (
            <Alert
              message="Your email doesn't have permission to sign in!"
              type="error"
              banner
            />
          )}
          {/* Error notification */}
          {isErr && (
            <Alert
              message="There is an error, please try again!"
              type="error"
              banner
            />
          )}
        </Form>
        
      </div>
  );
};
