import React, { FC } from "react";
import { Spin } from "antd";
import { useGetBoxQuery } from "../../../redux/api/boxApi";
import { BoxDetails } from "../../../components/BoxDetails";

interface DeliveryInformationBoxProps {
  boxId: string | undefined;
}

export const DeliveryInformationBox: FC<DeliveryInformationBoxProps> = ({
  boxId,
}) => {
  const { data: box, isLoading } = useGetBoxQuery(boxId, {
    skip: !boxId,
  });

  return (
    <Spin spinning={isLoading}>
      <BoxDetails box={box} />
    </Spin>
  );
};
