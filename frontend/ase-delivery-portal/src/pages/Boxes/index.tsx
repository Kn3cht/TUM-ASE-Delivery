import React, { FC, useState } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import styles from "../Users/users.module.scss";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Box } from "../../repository/types/box";
import {
  useDeleteBoxMutation,
  useListBoxesQuery,
} from "../../redux/api/boxApi";
import { ColumnProps } from "antd/es/table";
import { buildFullAddress, highlightText } from "../../utils/formatters";
import moment from "moment/moment";
import { CreateOrUpdateBoxModal } from "./CreateOrUpdateBoxModal";
import { useNavigate } from "react-router-dom";
import { boxContainsQueryString } from "../../utils/helpers";
import { UserRole } from "../../repository/types/user";
import { useCurrentUserQuery } from "../../redux/api/userApi";

const Boxes: FC = () => {
  const { formatMessage } = useIntl();

  const { data: currentUser } = useCurrentUserQuery();
  const userRole = currentUser?.role;

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>();

  const [createOrUpdateBoxOpen, setCreateOrUpdateBoxOpen] =
    useState<boolean>(false);
  const [currentBox, setCurrentBox] = useState<Box>();

  const { data, isLoading, error } = useListBoxesQuery();
  const boxes = data;

  const [deleteBoxMutation] = useDeleteBoxMutation();
  const onBoxDelete = (boxIdToDelete: string) => {
    deleteBoxMutation(boxIdToDelete)
      .unwrap()
      .then((data) => {
        message.info(`Box ${data.deletedBoxId} was deleted`);
      })
      .catch((error) => {
        console.error("delete", error);
        message.error("Box could not be deleted");
      });
  };

  const pickupBoxCols: ColumnProps<Box>[] = [
    {
      key: "name",
      title: formatMessage({ id: "boxes.table.name" }),
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, box) => highlightText(box.name, searchQuery),
    },
    {
      key: "raspiId",
      title: "Raspberry Pi Id",
      sorter: (a, b) => a.raspberryPiId.localeCompare(b.raspberryPiId),
      render: (_, box) => highlightText(box.raspberryPiId, searchQuery),
    },
    {
      key: "address",
      title: formatMessage({ id: "boxes.table.address" }),
      render: (_, record) =>
        highlightText(buildFullAddress(record.address), searchQuery),
    },
    {
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).diff(moment(b.createdAt)),
      title: formatMessage({ id: "boxes.table.created-at" }),
      render: (_, record) =>
        moment(record.createdAt).format("DD.MM.YYYY HH:mm"),
    },
    {
      key: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).diff(moment(b.updatedAt)),
      title: formatMessage({ id: "boxes.table.updated-at" }),
      render: (_, record) =>
        moment(record.updatedAt).format("DD.MM.YYYY HH:mm"),
    },
    {
      key: "actions",
      title: formatMessage({ id: "actions" }),
      render: (_, box) => (
        <Space>
          <Tooltip title={"Delete"}>
            <Popconfirm
              title={"Are you sure?"}
              onConfirm={() => onBoxDelete(box.id)}
            >
              <DeleteTwoTone
                twoToneColor={"red"}
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title={"edit"}>
            <EditTwoTone
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCurrentBox(box);
                setCreateOrUpdateBoxOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={"Preview"}>
            <EyeTwoTone
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/boxes/box/" + box.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredResults = boxes?.filter((box) =>
    boxContainsQueryString(box, searchQuery)
  );

  return (
    <PageWrapper error={!!error}>
      <div>
        <span className={styles.headerTitle}>Boxes</span>
        <div className={styles.actions}>
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder={"Enter search query..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type={"primary"}
              icon={<PlusOutlined />}
              onClick={() => setCreateOrUpdateBoxOpen(true)}
            >
              Create Box
            </Button>
          </Space>
        </div>
      </div>

      <Table
        loading={isLoading}
        columns={pickupBoxCols?.filter(
          (column) =>
            userRole === UserRole.DISPATCHER || column.key !== "raspiId"
        )}
        dataSource={filteredResults}
        rowKey={"id"}
        pagination={{ pageSize: 10 }}
      />
      <CreateOrUpdateBoxModal
        initialValue={currentBox}
        open={createOrUpdateBoxOpen}
        onClose={() => {
          setCurrentBox(undefined);
          setCreateOrUpdateBoxOpen(false);
        }}
      />
    </PageWrapper>
  );
};

export default Boxes;
