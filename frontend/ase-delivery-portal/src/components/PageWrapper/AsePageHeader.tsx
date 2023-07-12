import React, { FC } from "react";
import styles from "./page-wrapper.module.scss";
import { useIntl } from "react-intl";
import { Image } from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
import { AseNavigation } from "./AseNavigation";
import { AseRoute } from "../../utils/auth";

export const AsePageHeader: FC = () => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <div className={styles.logo} onClick={() => navigate(AseRoute.HOME)}>
        <Image src={"/logo.jpg"} height={44} preview={false} />
        <Title className={styles.title}>
          <i>{formatMessage({ id: "title" })}</i>
        </Title>
      </div>
      <AseNavigation />
    </div>
  );
};
