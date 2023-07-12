import React, { FC } from "react";
import { Box } from "../../../repository/types/box";
import Title from "antd/es/typography/Title";
import { Button, Card, Divider, Space } from "antd";
import { BoxSelect } from "../../../components/BoxSelect";
import { DropboxOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../../utils/auth";
import { BoxDetails } from "../../../components/BoxDetails";

interface DeliveryBoxProps {
  customerEmail: string;
  box: Box | undefined;
  onUpdate: (box: Box | undefined) => void;
}

export const DeliveryBox: FC<DeliveryBoxProps> = ({
  customerEmail,
  box,
  onUpdate,
}) => {
  const navigate = useNavigate();

  return (
    <Space style={{ width: "100%" }} direction={"vertical"}>
      <Card>
        <Title level={5}>
          <DropboxOutlined /> Select pick-up box
        </Title>
        <Divider />
        <p>
          Please select the pick-up box to which the delivery should be shipped
          to. The customer of the delivery will get notified about the package
          drop location after finalizing the delivery.
        </p>
        <BoxSelect
          customerEmail={customerEmail}
          style={{ width: "100%" }}
          value={box}
          onUpdate={onUpdate}
        />
        {!box && (
          <div>
            <Divider>Desired box not found?</Divider>
            <Button
              block
              type={"default"}
              icon={<PlusOutlined />}
              onClick={() => navigate(AseRoute.BOXES)}
            >
              Create box
            </Button>
          </div>
        )}
      </Card>
      {box && (
        <Card>
          <Title level={5}>Box information</Title>
          <Divider />
          <BoxDetails box={box} />
        </Card>
      )}
    </Space>
  );
};
