import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { HomeHeader } from "./HomeHeader";
import { ActionTiles } from "./ActionTiles";
import { Space } from "antd";
import { InfoCard } from "./InfoCard";
import { DeliveryTracking } from "./DeliveryTracking";
import { useCurrentUserQuery } from "../../redux/api/userApi";
import { UserRole } from "../../repository/types/user";

const Home: FC = () => {
  const { data: currentUser } = useCurrentUserQuery();

  const role = currentUser?.role;
  return (
    <PageWrapper compact>
      <Space direction={"vertical"} size={64} style={{ width: "100%" }}>
        <HomeHeader />
        {role === UserRole.CUSTOMER && <DeliveryTracking />}
        <InfoCard />
        <ActionTiles />
      </Space>
    </PageWrapper>
  );
};

export default Home;
