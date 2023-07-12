import React, { FC } from "react";
import { useListDeliveriesForBoxQuery } from "../../redux/api/deliveryApi";
import { Empty, List, Spin, Tooltip } from "antd";
import { DeliveryStatus } from "../../repository/types/delivery";
import moment from "moment/moment";
import {
  DeliveryStatusIcon,
  DeliveryStatusTitles,
} from "../../utils/enum-maps";
import { useNavigate } from "react-router-dom";
import styles from "./box-deliveries.module.scss";

interface BoxDeliveriesProps {
  boxId: string | undefined;
}

export const BoxDeliveries: FC<BoxDeliveriesProps> = ({ boxId }) => {
  const navigate = useNavigate();

  const { data: deliveries, isLoading } = useListDeliveriesForBoxQuery(boxId, {
    skip: !boxId,
  });

  const activeDeliveries = deliveries
    ?.map((delivery) => delivery.delivery)
    .filter((delivery) => delivery.status !== DeliveryStatus.COMPLETED);

  return (
    <Spin spinning={isLoading}>
      {!activeDeliveries?.length ? (
        <Empty description={"Box is empty"} />
      ) : (
        <List
          dataSource={activeDeliveries}
          renderItem={(delivery) => (
            <List.Item
              className={styles.listItem}
              onClick={() => navigate("/deliveries/delivery/" + delivery.id)}
            >
              <List.Item.Meta
                avatar={
                  <Tooltip title={DeliveryStatusTitles.get(delivery.status)}>
                    {DeliveryStatusIcon.get(delivery.status)}
                  </Tooltip>
                }
                title={delivery.customerEmail}
                description={`Created at: ${moment(delivery.createdAt).format(
                  "DD.MM.YYYY HH:mm"
                )} | Updated at: ${moment(delivery.updatedAt).format(
                  "DD.MM.YYYY HH:mm"
                )}`}
              />
            </List.Item>
          )}
        />
      )}
    </Spin>
  );
};
