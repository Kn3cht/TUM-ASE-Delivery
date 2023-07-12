import React, { FC, useEffect } from "react";
import styles from "./api.module.scss";
import { message, Result, Spin } from "antd";
import { useLocation, useParams } from "react-router";
import { useLazyCurrentUserQuery } from "../../redux/api/userApi";
import { AseRoute } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../repository/types/user";
import { usePickUpDeliveryMutation } from "../../redux/api/deliveryApi";

export const PickUpDelivery: FC = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { id } = useParams<{ id: string }>();

  const [getCurrentUserQuery, { isLoading: userLoading }] =
    useLazyCurrentUserQuery();

  const [pickUpDeliveryMutation, { isLoading: pickUpLoading }] =
    usePickUpDeliveryMutation();

  useEffect(() => {
    if (id) {
      getCurrentUserQuery()
        .unwrap()
        .then((user) => {
          // Only deliverers are allowed to access this route
          if (user?.role !== UserRole.DELIVERER) {
            message.error("You are not a deliverer!");
            navigate(AseRoute.FORBIDDEN);
          } else {
            pickUpDeliveryMutation(id)
              .unwrap()
              .then(() => {
                message.info("Delivery was picked up");
                navigate(AseRoute.DELIVERIES);
              })
              .catch((error) => {
                console.error(error);
                message.error("Delivery could not be picked up!");
              });
          }
        })
        .catch((error) => {
          console.error(error);
          navigate(AseRoute.LOGIN + "?destination=" + pathname);
        });
    }
  }, [id]);

  const loading = userLoading || pickUpLoading;

  return (
    <Spin spinning={loading}>
      <div className={styles.apiPage}>
        {!id && (
          <Result
            status={500}
            title="Error"
            subTitle="The delivery could not be found"
          />
        )}
      </div>
    </Spin>
  );
};
