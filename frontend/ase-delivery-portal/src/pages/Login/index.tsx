import React, {FC, useEffect, useState} from "react";
import styles from "./login.module.scss";
import { useIntl } from "react-intl";
import { PageWrapper } from "../../components/PageWrapper";
import { Button, Card, Col, Form, Image, Input, message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {useLazyGetCsrfQuery, useLoginMutation} from "../../redux/api/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AseRoute } from "../../utils/auth";
import Cookies from 'js-cookie';

const Login: FC = () => {
  const { formatMessage } = useIntl();

  const [csrfQuery, { isLoading: csrfLoading }] = useLazyGetCsrfQuery();
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();

  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email && password) {
      // execute xsrf
      csrfQuery()
          .unwrap()
          .then(() => {
            const csrfToken = Cookies.get("XSRF-TOKEN");
            if (csrfToken) {
              loginMutation({ email, password })
                  .unwrap()
                  .then(() => {
                    if (destination) {
                      navigate(destination);
                    } else {
                      navigate(AseRoute.HOME);
                    }
                  })
                  .catch((error) => {
                    console.error("Login error", error);
                    message.error("Login failed. Please check your credentials.");
                  });
            } else {
              console.error("CSRF Cookie is not present");
              message.error("Login failed.")
            }
          })
          .catch(() => {
            console.error("CSRF Token could not be obtained");
            message.error("Login failed.")
          });
    }
  };

  const loading = csrfLoading || loginLoading

  return (
    <PageWrapper>
      <div className={styles.login}>
        <Card className={styles.loginForm}>
          <Form>
            <div className={styles.logo}>
              <div className={styles.logoWrapper}>
                <Image src={"/logo.jpg"} width={150} preview={false} />
              </div>
            </div>
            <Row>
              <Col span={24}>
                <Form.Item name={"email"}>
                  <Input
                    size={"large"}
                    placeholder={formatMessage({ id: "placeholder.email" })}
                    prefix={<UserOutlined />}
                    type={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={"password"}>
                  <Input.Password
                    size={"large"}
                    placeholder={formatMessage({ id: "placeholder.password" })}
                    prefix={<LockOutlined />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button
              loading={loading}
              disabled={!email || !password}
              block
              type={"primary"}
              size={"large"}
              onClick={handleSubmit}
            >
              {formatMessage({ id: "action.login" })}
            </Button>
          </Form>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Login;
