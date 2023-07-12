import React, { FC } from "react";
import { Col, Row, Select, SelectProps } from "antd";
import { useListAvailableBoxesQuery } from "../redux/api/boxApi";
import { buildFullAddress } from "../utils/formatters";
import { Box } from "../repository/types/box";

interface BoxSelectProps extends SelectProps {
  customerEmail: string;
  value: Box | undefined;
  onUpdate: (value: Box | undefined) => void;
}

export const BoxSelect: FC<BoxSelectProps> = ({
  customerEmail,
  value,
  onUpdate,
  ...props
}) => {
  const { data: boxes, isLoading } = useListAvailableBoxesQuery(customerEmail);

  return (
    <Select
      {...props}
      placeholder={"Please select..."}
      loading={isLoading}
      allowClear
      value={
        value
          ? { value: value.id, key: value.id, label: value.name }
          : undefined
      }
      onChange={(valueUpdate) => {
        if (valueUpdate) {
          const foundBox = boxes?.find((box) => box.id === valueUpdate.value);
          onUpdate(foundBox);
        } else {
          onUpdate(undefined);
        }
      }}
      labelInValue={true}
      showSearch
    >
      {boxes?.map((box) => (
        <Select.Option key={box.id} value={box.id}>
          <Row>
            <Col span={24}>
              <b>{box.name}</b>
            </Col>
          </Row>
          <Row>
            <Col span={24}>{buildFullAddress(box.address)}</Col>
          </Row>
        </Select.Option>
      ))}
    </Select>
  );
};
