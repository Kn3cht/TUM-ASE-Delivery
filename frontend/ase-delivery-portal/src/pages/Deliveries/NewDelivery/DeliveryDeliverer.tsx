import React, { FC } from "react";
import { User, UserRole } from "../../../repository/types/user";
import { useNavigate } from "react-router-dom";
import { Button, Card, Divider, Space } from "antd";
import Title from "antd/es/typography/Title";
import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import { UserSelect } from "../../../components/UserSelect";
import { AseRoute } from "../../../utils/auth";
import { UserSummary } from "../../../components/UserSummary";

interface DeliveryDelivererProps {
  deliverer: User | undefined;
  onUpdate: (deliverer: User | undefined) => void;
}

export const DeliveryDeliverer: FC<DeliveryDelivererProps> = ({
  deliverer,
  onUpdate,
}) => {
  const navigate = useNavigate();

  return (
    <Space style={{ width: "100%" }} direction={"vertical"}>
      <Card>
        <Title level={5}>
          <CarOutlined /> Select deliverer
        </Title>
        <Divider />
        <p>Please select the deliverer that will deliver the delivery to the</p>
        <UserSelect
          roleFilter={UserRole.DELIVERER}
          style={{ width: "100%" }}
          value={deliverer}
          onUpdate={onUpdate}
        />
        {!deliverer && (
          <div>
            <Divider>Desired deliverer not found?</Divider>
            <Button
              block
              type={"default"}
              icon={<PlusOutlined />}
              onClick={() => navigate(AseRoute.USERS)}
            >
              Create deliverer
            </Button>
          </div>
        )}
      </Card>
      {deliverer && (
        <Card>
          <Title level={5}>User information</Title>
          <Divider />
          <UserSummary user={deliverer} />
        </Card>
      )}
    </Space>
  );
};
