import React, { FC } from "react";
import styles from "./action-tile.module.scss";
import { AseRoute } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

export interface ActionTileProps {
  key: string;
  backgroundImage: string;
  title: string;
  route: AseRoute;
}

export const ActionTile: FC<ActionTileProps> = ({
  backgroundImage,
  route,
  title,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.actionTile}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onClick={() => navigate(route)}
    >
      <div className={styles.content}>{title}</div>
    </div>
  );
};
