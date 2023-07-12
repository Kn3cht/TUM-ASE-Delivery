import React, { FC } from "react";
import { User, UserRole } from "../../../repository/types/user";
import { Button, Card, Divider, Space } from "antd";
import Title from "antd/es/typography/Title";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { AseRoute } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import { UserSelect } from "../../../components/UserSelect";
import { UserSummary } from "../../../components/UserSummary";

interface DeliveryCustomerProps {
  customer: User | undefined;
  onUpdate: (customer: User | undefined) => void;
}

export const DeliveryCustomer: FC<DeliveryCustomerProps> = ({
  customer,
  onUpdate,
}) => {
  const navigate = useNavigate();

  return (
    <Space style={{ width: "100%" }} direction={"vertical"}>
      <Card>
        <Title level={5}>
          <UserOutlined /> Select customer
        </Title>
        <Divider />
        <p>
          Please select the customer that ordered the delivery. After completion
          of the delivery creation users will get a delivery tracking code and
          will be provided with an access token to open the corresponding
          pick-up box.
        </p>
        <UserSelect
          roleFilter={UserRole.CUSTOMER}
          style={{ width: "100%" }}
          value={customer}
          onUpdate={onUpdate}
        />
        {!customer && (
          <div>
            <Divider>Desired customer not found?</Divider>
            <Button
              block
              type={"default"}
              icon={<PlusOutlined />}
              onClick={() => navigate(AseRoute.USERS)}
            >
              Create customer
            </Button>
          </div>
        )}
      </Card>
      {customer && (
        <Card>
          <Title level={5}>User information</Title>
          <Divider />
          <UserSummary user={customer} />
        </Card>
      )}
    </Space>
  );
};
