import React, { FC } from "react";
import { User, UserRole } from "../repository/types/user";
import { Col, Row, Select, SelectProps } from "antd";
import { useListUsersQuery } from "../redux/api/userApi";
import {UserRoleIcon, UserRoleTitles} from "../utils/enum-maps";

interface UserSelectProps extends SelectProps {
  // if no filter is applied all users are shown
  roleFilter?: UserRole;
  value: User | undefined;
  onUpdate: (value: User | undefined) => void;
}

export const UserSelect: FC<UserSelectProps> = ({
  roleFilter,
  value,
  onUpdate,
  ...props
}) => {
  const { data: usersRaw, isLoading } = useListUsersQuery();

  // Filter optionally for user role
  const users = usersRaw?.filter(
    (user) => !roleFilter || user.role === roleFilter
  );

  return (
    <Select
      {...props}
      placeholder={"Please select..."}
      loading={isLoading}
      allowClear
      value={
        value
          ? { value: value.id, key: value.id, label: value.email }
          : undefined
      }
      onChange={(valueUpdate) => {
        if (valueUpdate) {
          const foundUser = users?.find(
            (user) => user.id === valueUpdate.value
          );
          onUpdate(foundUser);
        } else {
          onUpdate(undefined);
        }
      }}
      labelInValue={true}
      showSearch
    >
      {users?.map((user) => (
        <Select.Option key={user.id} value={user.id}>
          <Row>
            <Col span={24}>
              <b>{user.email}</b>
            </Col>
          </Row>
          <Row>
            <Col span={24}>{UserRoleIcon.get(user.role)} {UserRoleTitles.get(user.role)}</Col>
          </Row>
        </Select.Option>
      ))}
    </Select>
  );
};
