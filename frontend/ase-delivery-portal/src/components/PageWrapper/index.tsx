import React, { FC, useEffect } from "react";
import styles from "./page-wrapper.module.scss";
import { Button, Layout, Result, Spin } from "antd";
import { AsePageHeader } from "./AsePageHeader";
import { Content } from "antd/es/layout/layout";
import { AseFooter } from "./AseFooter";
import { AseAuthentication } from "./AseAuthentication";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../utils/auth";

interface PageWrapperProps {
  compact?: boolean;
  loading?: boolean;
  // set error to true if the core data of the page could not be loaded
  error?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const PageWrapper: FC<PageWrapperProps> = ({
  compact,
  loading = false,
  children,
  error,
}) => {
  const content = <Content className={styles.content}>{children}</Content>;

  const navigate = useNavigate();

  return (
    <Layout className={styles.pageWrapper}>
      <Spin spinning={loading}>
        <AseAuthentication>
          <AsePageHeader />
          {error ? (
            <Result
              status="error"
              title="Something went wrong"
              subTitle="An error occurred while loading the page data."
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => navigate(AseRoute.HOME)}
                >
                  Back Home
                </Button>,
              ]}
            />
          ) : (
            <div>
              {compact ? (
                <div className={styles.compactContentWrapper}>
                  <div className={styles.compactContent}>{content}</div>
                </div>
              ) : (
                content
              )}
            </div>
          )}
          <AseFooter />
        </AseAuthentication>
      </Spin>
    </Layout>
  );
};
