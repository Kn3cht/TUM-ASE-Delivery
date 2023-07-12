import React, { FC, useEffect, useState } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { User, UserRole } from "../../repository/types/user";
import {UserRoleIcon, UserRoleTitles} from "../../utils/enum-maps";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApi";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

export const CreateOrUpdateUserModal: FC<CreateUserModalProps> = ({
  open,
  onClose: externalOnClose,
  user,
}) => {
  const [createUserMutation] = useCreateUserMutation();
  const [updateUserMutation] = useUpdateUserMutation();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);

  const onClose = () => {
    setEmail(undefined);
    setPassword(undefined);
    setRole(UserRole.CUSTOMER);
    externalOnClose();
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const createUser = () => {
    if (email && role && password) {
      createUserMutation({ email, role, password })
        .unwrap()
        .then((data) => {
          message.success(`User ${data.email} was created successfully`);
          onClose();
        })
        .catch(() => message.error("User could not be created"));
    } else {
      message.warning("All fields must be filled out!");
    }
  };

  const updateUser = () => {
    if (email && role && password && user?.id) {
      updateUserMutation({ email, role, password, id: user.id })
        .unwrap()
        .then((data) => {
          message.success(`User ${data.email} was updated successfully`);
          onClose();
        })
        .catch(() => message.error("User could not be created"));
    } else {
      message.warning("All fields must be filled out!");
    }
  };

  return (
    <Modal
      title={user ? `Update User: ${user.id}` : "Create User"}
      open={open}
      onCancel={onClose}
      onOk={user ? updateUser : createUser}
      okText={user ? "Update" : "Create"}
    >
      <Form layout={"vertical"}>
        <Row>
          <Col span={24}>
            <Form.Item
              required
              label={"E-Mail"}
              // name={"email"}
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input
                placeholder={"Please enter..."}
                value={email}
                // defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item required label={"Password"}>
              <Input.Password
                placeholder={"Enter password..."}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item required label={"Role"}>
              <Select value={role} onChange={(value) => setRole(value)}>
                {Object.keys(UserRole).map((userRole) => (
                  <Select.Option
                    // @ts-ignore
                    value={userRole}
                    key={userRole}
                  >
                    {UserRoleIcon.get(userRole as UserRole)} {UserRoleTitles.get(userRole as UserRole)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
