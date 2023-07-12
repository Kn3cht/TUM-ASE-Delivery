import React, { FC, useState } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { ColumnProps } from "antd/es/table";
import moment from "moment";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
  QrcodeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "../Users/users.module.scss";
import {
  DeliveryStatus,
  DeliveryWithTrackingUrl,
} from "../../repository/types/delivery";
import {
  useDeleteDeliveryMutation,
  useListDeliveriesQuery,
} from "../../redux/api/deliveryApi";
import {
  DeliveryStatusColor,
  DeliveryStatusIcon,
  DeliveryStatusTitles,
} from "../../utils/enum-maps";
import { deliveryContainsQueryString } from "../../utils/helpers";
import { highlightText } from "../../utils/formatters";
import { DeliveryQrCodeModal } from "./DeliveryQrCodeModal";
import { useCurrentUserQuery } from "../../redux/api/userApi";
import { UserRole } from "../../repository/types/user";

const Deliveries: FC = () => {
  const { formatMessage } = useIntl();

  const [searchQuery, setSearchQuery] = useState<string>();

  const { data: currentUser } = useCurrentUserQuery();
  const userRole = currentUser?.role;

  const [qrCodeModalOpen, setQrCodeModalOpen] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>();

  const navigate = useNavigate();

  const { data: deliveries, isLoading, error } = useListDeliveriesQuery();

  const [deleteDeliveryMutation] = useDeleteDeliveryMutation();
  const onDeliveryDelete = (id: string) => {
    deleteDeliveryMutation(id)
      .unwrap()
      .then((data) => {
        message.info(`Delivery ${data.deletedDeliveryId} was deleted`);
      })
      .catch((error) => {
        console.error("delete", error);
        message.error("Delivery could not be deleted");
      });
  };

  const deliveriesCols: ColumnProps<DeliveryWithTrackingUrl>[] = [
    {
      key: "customer",
      title: "Customer",
      render: (_, { delivery: { customerEmail } }) =>
        highlightText(customerEmail, searchQuery),
    },
    {
      key: "deliverer",
      title: "Deliverer",
      render: (_, { delivery: { courierEmail } }) =>
        highlightText(courierEmail, searchQuery),
    },
    {
      key: "status",
      title: "Status",
      filters: Object.keys(DeliveryStatus).map((status) => ({
        value: status,
        text: DeliveryStatusTitles.get(status as DeliveryStatus),
      })),
      onFilter: (value, record) => value === record.delivery.status,
      render: (_, { delivery: { status } }) => (
        <Tag
          icon={DeliveryStatusIcon.get(status)}
          color={DeliveryStatusColor.get(status)}
        >
          {DeliveryStatusTitles.get(status as DeliveryStatus)}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      sorter: (a, b) =>
        moment(a.delivery.createdAt).diff(moment(b.delivery.createdAt)),
      title: formatMessage({ id: "boxes.table.created-at" }),
      render: (_, delivery) =>
        moment(delivery.delivery.createdAt).format("DD.MM.YYYY HH:mm"),
    },
    {
      key: "updatedAt",
      sorter: (a, b) =>
        moment(a.delivery.createdAt).diff(moment(b.delivery.createdAt)),
      title: formatMessage({ id: "boxes.table.updated-at" }),
      render: (_, delivery) =>
        moment(delivery.delivery.updatedAt).format("DD.MM.YYYY HH:mm"),
    },
    {
      key: "qr-code",
      title: "QR-code",
      render: (_, { trackUrl }) => (
        <Tooltip title={"Show QR-code"}>
          <QrcodeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentUrl(trackUrl);
              setQrCodeModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      key: "actions",
      title: formatMessage({ id: "actions" }),
      render: (_, deliveryWrapper) => (
        <Space>
          {userRole === UserRole.DISPATCHER && (
            <Tooltip title={"Delete"}>
              <Popconfirm
                title={"Are you sure?"}
                onConfirm={() => onDeliveryDelete(deliveryWrapper.delivery.id)}
              >
                <DeleteTwoTone
                  twoToneColor={"red"}
                  style={{ cursor: "pointer" }}
                />
              </Popconfirm>
            </Tooltip>
          )}
          {userRole === UserRole.DISPATCHER && (
            <Tooltip title={"Edit"}>
              <EditTwoTone
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(
                    "/deliveries/new-delivery/" + deliveryWrapper.delivery.id
                  );
                }}
              />
            </Tooltip>
          )}
          <Tooltip title={"Preview"}>
            <EyeTwoTone
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/deliveries/delivery/" + deliveryWrapper.delivery.id)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredResults = deliveries
    ?.filter((delivery) =>
      deliveryContainsQueryString(delivery.delivery, searchQuery)
    )
    ?.sort((a, b) =>
      moment(b.delivery.createdAt).diff(moment(a.delivery.createdAt))
    );

  return (
    <PageWrapper error={!!error}>
      <div>
        <span className={styles.headerTitle}>Deliveries</span>
        <div className={styles.actions}>
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder={"Enter search query..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {userRole === UserRole.DISPATCHER && (
              <Button
                type={"primary"}
                icon={<PlusOutlined />}
                onClick={() => navigate("/deliveries/new-delivery")}
              >
                Create Delivery
              </Button>
            )}
          </Space>
        </div>
      </div>

      <Table
        loading={isLoading}
        columns={deliveriesCols?.filter(
          (column) => userRole !== UserRole.CUSTOMER || column.key !== "qr-code"
        )}
        dataSource={filteredResults}
        rowKey={({ delivery }) => delivery.id}
        pagination={{ pageSize: 10 }}
      />
      <DeliveryQrCodeModal
        open={qrCodeModalOpen}
        onClose={() => {
          setQrCodeModalOpen(false);
          setCurrentUrl(undefined);
        }}
        value={currentUrl}
      />
    </PageWrapper>
  );
};

export default Deliveries;
