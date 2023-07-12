import React, { FC } from "react";
import Title from "antd/es/typography/Title";
import { CheckOutlined } from "@ant-design/icons";
import { Card, Divider, Space } from "antd";
import { UserSummary } from "../../../components/UserSummary";
import { User } from "../../../repository/types/user";
import { Box } from "../../../repository/types/box";
import { BoxDetails } from "../../../components/BoxDetails";

interface DeliverySummaryProps {
  customer: User | undefined;
  box: Box | undefined;
  deliverer: User | undefined;
}

export const DeliverySummary: FC<DeliverySummaryProps> = ({
  customer,
  box,
  deliverer,
}) => {
  return (
    <Space style={{ width: "100%" }} direction={"vertical"}>
      <Card>
        <Title level={5}>
          <CheckOutlined /> Summary
        </Title>
        <p>Please double check the entered information are correct.</p>
      </Card>
      <Card>
        <Title level={5}>Customer</Title>
        <Divider />
        <UserSummary user={customer} />
      </Card>
      <Card>
        <Title level={5}>Box</Title>
        <Divider />
        <BoxDetails box={box} />
      </Card>
      <Card>
        <Title level={5}>Deliverer</Title>
        <Divider />
        <UserSummary user={deliverer} />
      </Card>
    </Space>
  );
};
