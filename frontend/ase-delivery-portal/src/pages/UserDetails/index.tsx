import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { Card } from "antd";
import Title from "antd/es/typography/Title";
import { useCurrentUserQuery } from "../../redux/api/userApi";
import { UserSummary } from "../../components/UserSummary";

const UserDetails: FC = () => {
  const { data: currentUser, isLoading, error } = useCurrentUserQuery();

  return (
    <PageWrapper compact loading={isLoading} error={!!error}>
      <Card>
        <Title level={3}>Account Details</Title>
        <UserSummary user={currentUser} />
      </Card>
    </PageWrapper>
  );
};

export default UserDetails;
