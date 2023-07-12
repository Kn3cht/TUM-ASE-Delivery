import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import React, { FC, useState } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { ColumnProps } from "antd/es/table";
import { User, UserRole } from "../../repository/types/user";
import {
  UserRoleColor,
  UserRoleIcon,
  UserRoleTitles,
} from "../../utils/enum-maps";
import {
  useCurrentUserQuery,
  useDeleteUserMutation,
  useListUsersQuery,
} from "../../redux/api/userApi";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { CreateOrUpdateUserModal } from "./CreateOrUpdateUserModal";
import styles from "./users.module.scss";

const Users: FC = () => {
  const [createUserModalOpen, setCreateUserModalOpen] =
    useState<boolean>(false);

  const { data: currentUser } = useCurrentUserQuery();

  const [selectedUser, setSelectedUser] = useState<User>();

  const { data: users, isLoading, error } = useListUsersQuery();

  const [deleteUserMutation] = useDeleteUserMutation();

  const deleteUser = (id: string) => {
    deleteUserMutation(id);
  };

  const userColumns: ColumnProps<User>[] = [
    {
      key: "email",
      title: "E-Mail",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      key: "role",
      title: "Role",
      filters: Object.keys(UserRole).map((role) => ({
        value: role,
        text: UserRoleTitles.get(role as UserRole),
      })),
      onFilter: (value, record) => record.role === (value as UserRole),
      render: (_, user) => (
        <Tag
          icon={UserRoleIcon.get(user.role)}
          color={UserRoleColor.get(user.role)}
        >
          {UserRoleTitles.get(user.role)}
        </Tag>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, user) => {
        return user?.id !== currentUser?.id ? (
          <Space>
            <Tooltip title={"Delete"}>
              <Popconfirm
                title={"Are you sure?"}
                onConfirm={() => deleteUser(user.id)}
              >
                <DeleteTwoTone
                  twoToneColor={"red"}
                  style={{ cursor: "pointer" }}
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title={"Edit"}>
              <EditTwoTone
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedUser(user);
                  setCreateUserModalOpen(true);
                }}
              />
            </Tooltip>
          </Space>
        ) : null;
      },
    },
  ];

  return (
    <PageWrapper error={!!error}>
      <Space direction={"vertical"} style={{ width: "100%" }}>
        <div>
          <span className={styles.headerTitle}>Users</span>
          <Button
            className={styles.actions}
            type={"primary"}
            icon={<PlusOutlined />}
            onClick={() => setCreateUserModalOpen(true)}
          >
            Create User
          </Button>
        </div>

        <Table
          rowKey={"id"}
          loading={isLoading}
          columns={userColumns}
          dataSource={users}
        />
      </Space>
      <CreateOrUpdateUserModal
        user={selectedUser}
        open={createUserModalOpen}
        onClose={() => {
          setCreateUserModalOpen(false);
          setSelectedUser(undefined);
        }}
      />
    </PageWrapper>
  );
};

export default Users;
