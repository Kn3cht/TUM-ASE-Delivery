import React, { FC } from "react";
import { Box } from "../../repository/types/box";
import { List } from "antd";
import {
  DropboxOutlined,
  InboxOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { AseListItem } from "../UserSummary";
import { buildFullAddress } from "../../utils/formatters";
import { useCurrentUserQuery } from "../../redux/api/userApi";
import { UserRole } from "../../repository/types/user";

interface BoxDetailsProps {
  box: Box | undefined;
}

export const BoxDetails: FC<BoxDetailsProps> = ({ box }) => {
  const { data: currentUser } = useCurrentUserQuery();
  const userRole = currentUser?.role;

  const boxDetails: AseListItem[] = [
    {
      title: "Name",
      value: box?.name || "-",
      icon: <DropboxOutlined />,
    },
    {
      title: "Address",
      value: box?.address ? buildFullAddress(box.address) : "-",
      icon: <PushpinOutlined />,
    },
  ];

  if (userRole === UserRole.DISPATCHER) {
    boxDetails.push({
      title: "Raspberry Pi Id",
      value: box?.raspberryPiId || "-",
      icon: <InboxOutlined />,
    });
  }

  return (
    <div>
      <List
        dataSource={boxDetails}
        renderItem={({ icon, title, value }) => (
          <List.Item>
            <List.Item.Meta avatar={icon} title={title} description={value} />
          </List.Item>
        )}
      />
    </div>
  );
};
