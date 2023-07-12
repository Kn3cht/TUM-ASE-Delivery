import React, { FC } from "react";
import styles from "./action-tile.module.scss";
import Background from "./background-images/user-management.jpg";

export const BoxManagement: FC = () => {
  return (
    <div
      className={styles.actionTile}
      style={{ backgroundImage: `url(${Background})` }}
    >
      asdf
    </div>
  );
};
