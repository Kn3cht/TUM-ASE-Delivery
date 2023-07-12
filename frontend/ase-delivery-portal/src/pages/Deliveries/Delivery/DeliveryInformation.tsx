import React, { FC } from "react";
import { Collapse } from "antd";
import { Delivery } from "../../../repository/types/delivery";
import { CarOutlined, DropboxOutlined, UserOutlined } from "@ant-design/icons";
import { useCurrentUserQuery } from "../../../redux/api/userApi";
import { DeliveryInformationUser } from "./DeliveryInformationUser";
import { DeliveryInformationBox } from "./DeliveryInformationBox";
import { UserRole } from "../../../repository/types/user";

const { Panel } = Collapse;

interface DeliveryInformationProps {
  delivery: Delivery | undefined;
}

export const DeliveryInformation: FC<DeliveryInformationProps> = ({
  delivery,
}) => {
  const { data: currentUser } = useCurrentUserQuery();
  const userRole = currentUser?.role;

  const customerEmail = delivery?.customerEmail;
  const delivererEmail = delivery?.courierEmail;
  const boxId = delivery?.boxId;

  return (
    <Collapse>
      {userRole === UserRole.DISPATCHER && (
        <Panel
          header={
            <span>
              <UserOutlined /> Customer details
            </span>
          }
          key="customer"
        >
          <DeliveryInformationUser email={customerEmail} />
        </Panel>
      )}
      {userRole === UserRole.DISPATCHER && (
        <Panel
          header={
            <span>
              <CarOutlined /> Deliverer details
            </span>
          }
          key="deliverer"
        >
          <DeliveryInformationUser email={delivererEmail} />
        </Panel>
      )}
      <Panel
        header={
          <span>
            <DropboxOutlined /> Box details
          </span>
        }
        key="box"
      >
        <DeliveryInformationBox boxId={boxId} />
      </Panel>
    </Collapse>
  );
};
