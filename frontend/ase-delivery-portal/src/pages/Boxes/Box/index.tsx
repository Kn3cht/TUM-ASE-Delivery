import React, { FC, useState } from "react";
import { PageWrapper } from "../../../components/PageWrapper";
import { useParams } from "react-router";
import styles from "../boxes.module.scss";
import { Button, Card, Space } from "antd";
import { useGetBoxQuery } from "../../../redux/api/boxApi";
import { EditOutlined } from "@ant-design/icons";
import { CreateOrUpdateBoxModal } from "../CreateOrUpdateBoxModal";
import { BoxDetails } from "../../../components/BoxDetails";
import Title from "antd/es/typography/Title";
import { TimestampCard } from "../../../components/TimestampCard";
import { BoxDeliveries } from "../../../components/BoxDeliveries";

const BoxPreview: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: box, isLoading, error } = useGetBoxQuery(id!);

  const [createOrUpdateBoxOpen, setCreateOrUpdateBoxOpen] =
    useState<boolean>(false);

  const handleEdit = () => {
    setCreateOrUpdateBoxOpen(true);
  };

  return (
    <PageWrapper compact loading={isLoading} error={!!error}>
      <Space style={{ width: "100%" }} direction={"vertical"}>
        <div>
          <span className={styles.headerTitle}>Box preview</span>
          <div className={styles.actions}>
            <Space>
              <Button
                type={"primary"}
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </Space>
          </div>
        </div>
        <Card>
          <Title level={4}>Box configuration</Title>
          <BoxDetails box={box} />
        </Card>
        <Card>
          <Title level={4}>Deliveries in box</Title>
          <BoxDeliveries boxId={box?.id} />
        </Card>
        <TimestampCard createdAt={box?.createdAt} updatedAt={box?.updatedAt} />
      </Space>

      <CreateOrUpdateBoxModal
        initialValue={box}
        open={createOrUpdateBoxOpen}
        onClose={() => {
          setCreateOrUpdateBoxOpen(false);
        }}
      />
    </PageWrapper>
  );
};

export default BoxPreview;
