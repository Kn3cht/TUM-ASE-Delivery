import React, { FC } from "react";
import { Card, Divider } from "antd";
import { AseQrCode } from "../../../AseQrCode";
import Title from "antd/es/typography/Title";

interface DeliveryQrCodeProps {
  trackingUrl: string | undefined;
}

export const DeliveryQrCode: FC<DeliveryQrCodeProps> = ({ trackingUrl }) => {
  return (
    <Card>
      <Title level={4}>Delivery Qr-code</Title>
      <Divider />
      <AseQrCode small value={trackingUrl} />
    </Card>
  );
};
