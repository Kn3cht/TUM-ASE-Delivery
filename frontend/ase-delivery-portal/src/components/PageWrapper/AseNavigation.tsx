import React, { FC } from "react";
import styles from "./page-wrapper.module.scss";
import {useCurrentUserQuery, useLazyCurrentUserQuery, userApi} from "../../redux/api/userApi";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import {
  DropboxOutlined,
  InboxOutlined,
  LoginOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../utils/auth";
import { useLocation } from "react-router";
import { useLogoutMutation } from "../../redux/api/authApi";
import { UserRole } from "../../repository/types/user";
import store from "../../redux";

interface NavItem {
  route: AseRoute;
  text: string;
  key: string;
  icon: React.ReactNode;
}

export const AseNavigation: FC = () => {
  const { data: currentUser } = useCurrentUserQuery();

  const [logoutMutation] = useLogoutMutation();

  const isLoggedIn = !!currentUser;

  const navigate = useNavigate();

  const userRole = currentUser?.role;

  const items: MenuProps["items"] = [
    {
      key: "user",
      label: "Account",
      onClick: () => navigate(AseRoute.USER_DETAILS),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        logoutMutation()
          .then(() => {
            store.dispatch(userApi.util.resetApiState());
            navigate(AseRoute.LOGIN);
          })
          .catch((error) => console.error("Logout failed", error));
      },
    },
  ];

  const location = useLocation();
  const { pathname } = location;

  const navItems: NavItem[] = [
    {
      key: "deliveries",
      text: "Deliveries",
      route: AseRoute.DELIVERIES,
      icon: <DropboxOutlined />,
    },
    {
      key: "boxes",
      text: "Boxes",
      route: AseRoute.BOXES,
      icon: <InboxOutlined />,
    },
    {
      key: "users",
      text: "Users",
      route: AseRoute.USERS,
      icon: <UsergroupAddOutlined />,
    },
    {
      key: "statistics",
      text: "Statistics",
      route: AseRoute.STATISTICS,
      icon: <PieChartOutlined />,
    },
  ];

  const filteredNavItems = navItems.filter((navItem) => {
    switch (userRole) {
      case UserRole.DISPATCHER:
        return true;
      case UserRole.CUSTOMER:
      case UserRole.DELIVERER:
        return navItem.key === "deliveries";
    }
    return false;
  });

  return (
    <div className={styles.navigation}>
      {isLoggedIn ? (
        <div>
          {filteredNavItems.map(({ key, text, route, icon }) => (
            <Button
              icon={icon}
              key={key}
              type={"text"}
              style={
                location.pathname === route.valueOf()
                  ? { color: "darkorange" }
                  : undefined
              }
              onClick={() => navigate(route)}
            >
              {text}
            </Button>
          ))}
          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <Avatar
              style={{
                backgroundColor: "#EF9436",
                cursor: "pointer",
                marginLeft: 7,
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      ) : (
        <Button
          icon={<LoginOutlined />}
          type={"text"}
          style={pathname === AseRoute.LOGIN ? { display: "none" } : undefined}
          onClick={() => navigate(AseRoute.LOGIN)}
        >
          Login
        </Button>
      )}
    </div>
  );
};
