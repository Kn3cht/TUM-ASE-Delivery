import React, { FC } from "react";
import { DeliveryStatus } from "../../../repository/types/delivery";
import { Card, Divider, StepProps, Steps } from "antd";
import Title from "antd/es/typography/Title";
import { DeliveryStatusTitles } from "../../../utils/enum-maps";

interface DeliveryStatusCardProps {
  status: DeliveryStatus | undefined;
}

const statusSteps: StepProps[] = [
  {
    title: DeliveryStatusTitles.get(DeliveryStatus.CREATED)!,
    description: "The delivery was created.",
  },
  {
    title: DeliveryStatusTitles.get(DeliveryStatus.EN_ROUTE)!,
    description: "The delivery is on the way!",
  },
  {
    title: DeliveryStatusTitles.get(DeliveryStatus.DELIVERED)!,
    description:
      "The delivery was delivered to the pick-up box and is ready to be collected.",
  },
  {
    title: DeliveryStatusTitles.get(DeliveryStatus.COMPLETED)!,
    description: "The delivery was picked up by the customer.",
  },
];

const statusToStep = (status: DeliveryStatus | undefined): number => {
  if (!status) {
    return 0;
  }
  switch (status) {
    case DeliveryStatus.CREATED:
      return 0;
    case DeliveryStatus.EN_ROUTE:
      return 1;
    case DeliveryStatus.DELIVERED:
      return 2;
    case DeliveryStatus.COMPLETED:
      return 3;
  }
};

// Workflow: Created -> En_Route -> Delivered -> Completed
export const DeliveryStatusCard: FC<DeliveryStatusCardProps> = ({ status }) => {
  return (
    <Card>
      <Title level={4}>Delivery status</Title>
      <Divider />
      <Steps
        direction="vertical"
        size="small"
        current={statusToStep(status)}
        items={statusSteps}
      />
    </Card>
  );
};
