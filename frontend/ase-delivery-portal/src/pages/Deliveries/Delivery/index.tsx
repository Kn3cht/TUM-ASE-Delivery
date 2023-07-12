import React, { FC } from "react";
import { PageWrapper } from "../../../components/PageWrapper";
import styles from "../../Users/users.module.scss";
import { Button, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { DeliveryStatusCard } from "../../../components/Delivery/DeliveryStatusCard";
import { useParams } from "react-router";
import { useGetDeliveryQuery } from "../../../redux/api/deliveryApi";
import { TimestampCard } from "../../../components/TimestampCard";
import { DeliveryInformation } from "./DeliveryInformation";
import { useNavigate } from "react-router-dom";
import { useCurrentUserQuery } from "../../../redux/api/userApi";
import { UserRole } from "../../../repository/types/user";
import { DeliveryQrCode } from "./DeliveryQrCode";

const Delivery: FC = () => {
  const navigate = useNavigate();

  const { data: currentUser, isLoading: userLoading } = useCurrentUserQuery();
  const userRole = currentUser?.role;

  const { id } = useParams<{ id: string }>();
  const {
    data: deliveryWrapper,
    isLoading: deliveryLoading,
    error,
  } = useGetDeliveryQuery(id, {
    skip: !id,
  });
  const trackingUrl = deliveryWrapper?.trackUrl;
  const delivery = deliveryWrapper?.delivery;

  const handleEdit = () => {
    navigate("/deliveries/new-delivery/" + id);
  };

  const loading = deliveryLoading || userLoading;

  return (
    <PageWrapper compact loading={loading} error={!!error}>
      <Space style={{ width: "100%" }} direction={"vertical"}>
        {userRole === UserRole.DISPATCHER && (
          <div>
            <span className={styles.headerTitle}>Delivery preview</span>
            <div className={styles.actions}>
              <Space>
                <Button
                  disabled={!id}
                  type={"primary"}
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </Space>
            </div>
          </div>
        )}

        <DeliveryStatusCard status={delivery?.status} />
        <DeliveryInformation delivery={delivery} />
        {userRole &&
          [UserRole.DELIVERER, UserRole.DISPATCHER].includes(userRole) && (
            <DeliveryQrCode trackingUrl={trackingUrl} />
          )}
        <TimestampCard
          createdAt={delivery?.createdAt}
          updatedAt={delivery?.updatedAt}
        />
      </Space>
    </PageWrapper>
  );
};

export default Delivery;
