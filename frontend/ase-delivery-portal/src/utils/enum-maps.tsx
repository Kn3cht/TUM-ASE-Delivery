import { UserRole } from "../repository/types/user";
import { DeliveryStatus } from "../repository/types/delivery";
import React from "react";
import {
  CarOutlined,
  CheckOutlined,
  DropboxOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const UserRoleTitles = new Map<UserRole, string>([
  [UserRole.DISPATCHER, "Dispatcher"],
  [UserRole.CUSTOMER, "Customer"],
  [UserRole.DELIVERER, "Deliverer"],
]);

export const UserRoleIcon = new Map<UserRole, React.ReactNode>([
  [UserRole.DISPATCHER, <DropboxOutlined />],
  [UserRole.CUSTOMER, <UserOutlined />],
  [UserRole.DELIVERER, <CarOutlined />],
]);

export const UserRoleColor = new Map<UserRole, string>([
  [UserRole.DISPATCHER, "blue"],
  [UserRole.CUSTOMER, "default"],
  [UserRole.DELIVERER, "orange"],
]);

export const DeliveryStatusTitles = new Map<DeliveryStatus, string>([
  [DeliveryStatus.CREATED, "Created"],
  [DeliveryStatus.EN_ROUTE, "On the way"],
  [DeliveryStatus.DELIVERED, "Delivered"],
  [DeliveryStatus.COMPLETED, "Completed"],
]);

export const DeliveryStatusIcon = new Map<DeliveryStatus, React.ReactNode>([
  [DeliveryStatus.CREATED, <DropboxOutlined />],
  [DeliveryStatus.EN_ROUTE, <CarOutlined />],
  [DeliveryStatus.DELIVERED, <InboxOutlined />],
  [DeliveryStatus.COMPLETED, <CheckOutlined />],
]);

export const DeliveryStatusColor = new Map<DeliveryStatus, string>([
  [DeliveryStatus.CREATED, "default"],
  [DeliveryStatus.EN_ROUTE, "blue"],
  [DeliveryStatus.DELIVERED, "cyan"],
  [DeliveryStatus.COMPLETED, "success"],
]);
