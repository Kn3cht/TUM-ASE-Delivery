import React, { FC } from "react";
import { Outlet } from "react-router-dom";

export const DeliveryConfigWrapper: FC = () => (
  <div>
    <Outlet />
  </div>
);
