import React, { FC, useState } from "react";
import styles from "./home.module.scss";
import Title from "antd/es/typography/Title";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AseRoute } from "../../utils/auth";
import { useLazyTrackDeliveryQuery } from "../../redux/api/deliveryApi";
import { SendOutlined } from "@ant-design/icons";

export const DeliveryTracking: FC = () => {
  const navigate = useNavigate();

  const [trackingCode, setTrackingCode] = useState<string>();

  const [trackDeliveryQuery, { isLoading: trackingLoading }] =
    useLazyTrackDeliveryQuery();

  const handleSubmit = () => {
    if (trackingCode) {
      trackDeliveryQuery(trackingCode)
        .unwrap()
        .then((deliveryWrapper) => {
          if (deliveryWrapper?.delivery?.id) {
            navigate(
              AseRoute.DELIVERIES + `/delivery/${deliveryWrapper?.delivery?.id}`
            );
          } else {
            message.warning(
              `There is no active delivery for the tracking code ${trackingCode}`
            );
          }
        })
        .catch(() => {
          message.warning(
            `There is no active delivery for the tracking code ${trackingCode}`
          );
        });
    }
  };

  return (
    <div className={styles.deliveryTracking}>
      <Title level={4}>Track your delivery</Title>
      <p>
        Enter the delivery tracking code to see the status of your delivery.
      </p>
      <Input.Group compact style={{ width: "100%" }}>
        <Input
          placeholder={"Enter deliver tracking code..."}
          style={{ width: "calc(100% - 100px)" }}
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
        />
        <Button
          icon={<SendOutlined />}
          loading={trackingLoading}
          disabled={!trackingCode}
          type="primary"
          onClick={handleSubmit}
          style={{ width: 100, backgroundColor: "#b44909", color: "white" }}
        >
          Submit
        </Button>
      </Input.Group>
    </div>
  );
};
