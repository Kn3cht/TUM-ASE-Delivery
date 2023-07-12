import React, { FC, useEffect } from "react";
import {
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
} from "../../redux/api/userApi";
import { useLocation } from "react-router";
import { message, Spin } from "antd";
import { AseRoute, isAuthorizedForRoute } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../repository/types/user";

interface AseAuthenticationProps {
  children: React.ReactNode[];
}

export const AseAuthentication: FC<AseAuthenticationProps> = ({ children }) => {
  const [fetchCurrentUser, { isLoading }] = useLazyCurrentUserQuery();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleAuthentication = (userRole: UserRole | undefined) => {
    if (!isAuthorizedForRoute(userRole, pathname)) {
      if (!userRole) {
        message.info("Login required");
        navigate(AseRoute.LOGIN + "?destination=" + pathname);
      } else {
        navigate(AseRoute.FORBIDDEN);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser()
      .unwrap()
      .then((user) => {
        const userRole = user?.role;
        handleAuthentication(userRole);
      })
      .catch(() => {
        handleAuthentication(undefined);
      });
  }, []);

  return <Spin spinning={isLoading}>{children}</Spin>;
};
