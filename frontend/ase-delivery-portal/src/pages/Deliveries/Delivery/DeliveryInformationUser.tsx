import React, { FC } from "react";
import { Spin } from "antd";
import { useGetUserByEmailQuery } from "../../../redux/api/userApi";
import { UserSummary } from "../../../components/UserSummary";

interface DeliveryInformationUserProps {
  email: string | undefined;
}

export const DeliveryInformationUser: FC<DeliveryInformationUserProps> = ({
  email,
}) => {
  const { data: user, isLoading } = useGetUserByEmailQuery(email, {
    skip: !email,
  });

  return (
    <Spin spinning={isLoading}>
      <UserSummary user={user} />
    </Spin>
  );
};
