import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../utils/auth";

const FourOhFour: FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate(AseRoute.HOME)}>
            Back Home
          </Button>
        }
      />
    </PageWrapper>
  );
};

export default FourOhFour;
