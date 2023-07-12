import React, { FC } from "react";
import { Footer } from "antd/es/layout/layout";
import styles from "./page-wrapper.module.scss";
import { Col, Row } from "antd";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

export const linkedInProfiles: { name: string; url: string }[] = [
  {
    name: "Gerald Mahlknecht",
    url: "https://www.linkedin.com/in/gerald-mahlknecht-084074181/",
  },
  {
    name: "Maximilian Märkl",
    url: "https://www.linkedin.com/in/maximilian-m%C3%A4rkl-21079923b",
  },
  {
    name: "Alessandro Escher",
    url: "https://www.linkedin.com/in/alessandro-escher/",
  },
  {
    name: "Varun Srivastava",
    url: "https://www.linkedin.com/in/varun1904",
  },
];

export const AseFooter: FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Footer className={styles.footer}>
      <div className={styles.footerContent}>
        <Row justify={"space-between"}>
          <Col span={6}>
            <div className={styles.footerTitle}>
              <b>{formatMessage({ id: "team" })}</b>
            </div>
            {linkedInProfiles.map((profile) => (
              <div key={profile.url}>
                <a href={profile.url} target={"_blank"} rel={"noreferrer"}>
                  {profile.name}
                </a>
              </div>
            ))}
          </Col>
          <Col span={6}>
            <b>Credits</b>
            <div>
              <a
                href={"https://www.freepik.com/"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                freepik
              </a>
            </div>
          </Col>
          <Col span={6}>
            <b>{formatMessage({ id: "privacy" })}</b>
            <div>
              <Link to={"/imprint"} target={"_blank"} rel={"noreferrer"}>
                Imprint
              </Link>
            </div>
            <div>
              <Link to={"/privacy"} target={"_blank"} rel={"noreferrer"}>
                Privacy policy
              </Link>
            </div>
          </Col>
        </Row>
        <div className={styles.copyRight}>
          <div>© 2023 Team 4</div>
        </div>
      </div>
    </Footer>
  );
};
