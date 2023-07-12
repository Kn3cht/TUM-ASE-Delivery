import React, { FC } from "react";
import { User } from "../../repository/types/user";
import { List } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { UserRoleTitles } from "../../utils/enum-maps";

interface UserSummaryProps {
  user: User | undefined;
}

export interface AseListItem {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const UserSummary: FC<UserSummaryProps> = ({ user }) => {
  const userDetails: AseListItem[] = [
    {
      title: "E-Mail",
      value: user?.email || "-",
      icon: <MailOutlined />,
    },
    {
      title: "Role",
      value: user?.role ? UserRoleTitles.get(user.role)! : "-",
      icon: <UserOutlined />,
    },
  ];

  return (
    <List
      dataSource={userDetails}
      renderItem={({ icon, title, value }) => (
        <List.Item>
          <List.Item.Meta avatar={icon} title={title} description={value} />
        </List.Item>
      )}
    />
  );
};
