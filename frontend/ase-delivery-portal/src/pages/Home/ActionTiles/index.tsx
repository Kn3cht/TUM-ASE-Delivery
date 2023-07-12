import React, { FC } from "react";
import { Col, Row } from "antd";
import { ActionTile, ActionTileProps } from "./ActionTile";
import { AseRoute } from "../../../utils/auth";
import UserManagementImage from "./background-images/user-management.jpg";
import BoxManagementImage from "./background-images/pick-up-box-management.png";
import DeliveryManagementImage from "./background-images/delivery-management.jpg";
import { useCurrentUserQuery } from "../../../redux/api/userApi";
import { UserRole } from "../../../repository/types/user";

export const ActionTiles: FC = () => {
  const { data: currentUser } = useCurrentUserQuery();

  const role = currentUser?.role;

  const tiles: ActionTileProps[] = [
    {
      key: "boxes",
      title: "Pick-Up Box Management",
      route: AseRoute.BOXES,
      backgroundImage: BoxManagementImage,
    },
    {
      key: "deliveries",
      title: "Deliveries",
      route: AseRoute.DELIVERIES,
      backgroundImage: DeliveryManagementImage,
    },
    {
      key: "users",
      title: "User Management",
      route: AseRoute.USERS,
      backgroundImage: UserManagementImage,
    },
  ];

  const filteredTiles = tiles.filter((tile) => {
    switch (role) {
      case UserRole.DISPATCHER:
        return true;
      case UserRole.CUSTOMER:
      case UserRole.DELIVERER:
        return tile.key === "deliveries";
    }
    return false;
  });

  return (
    <Row gutter={32}>
      {filteredTiles.map((tile) => (
        <Col span={8} key={tile.key}>
          <ActionTile {...tile} />
        </Col>
      ))}
    </Row>
  );
};
