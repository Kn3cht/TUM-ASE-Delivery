import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../utils/auth";

const Forbidden: FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => navigate(AseRoute.HOME)}>
            Back Home
          </Button>
        }
      />
    </PageWrapper>
  );
};

export default Forbidden;
