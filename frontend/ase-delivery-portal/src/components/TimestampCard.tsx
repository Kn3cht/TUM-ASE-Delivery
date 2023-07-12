import React, { FC } from "react";
import { Card } from "antd";
import moment from "moment";

interface TimestampCardProps {
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export const TimestampCard: FC<TimestampCardProps> = ({
  createdAt,
  updatedAt,
}) => {
  return (
    <Card style={{ textAlign: "center", color: "#606060", fontSize: "0.8em" }}>
      {`Created at: ${moment(createdAt).format(
        "DD.MM.YYYY HH:mm"
      )} | Updated at: ${moment(updatedAt).format("DD.MM.YYYY HH:mm")}`}
    </Card>
  );
};
