import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useIntl } from "react-intl";
import {
  AddressInput,
  Box,
  BoxInput,
  Country,
} from "../../repository/types/box";
import { countryFlagMap, countryLocalizationMap } from "../../utils/formatters";
import {
  useCreateBoxMutation,
  useUpdateBoxMutation,
} from "../../redux/api/boxApi";

const { Option } = Select;

interface CreateOrUpdateBoxModalProps {
  // If set this modal will be an update modal
  initialValue: Box | undefined;
  open: boolean;
  onClose: () => void;
}

const validAddressInput = (address: AddressInput | undefined): boolean => {
  if (!address) {
    return false;
  }
  const { city, country, zipCode, street, houseNumber } = address;
  return !!city && !!country && !!zipCode && !!street && !!houseNumber;
};

const validateAddress = (address: AddressInput): boolean => {
  return (
    !!address.houseNumber &&
    !!address.country &&
    !!address.city &&
    !!address.zipCode
  );
};

const mockBox: BoxInput = {
  name: "Test Box",
  address: {
    street: "Test street",
    city: "Munich",
    addition: "No addition",
    country: Country.GERMANY,
    houseNumber: 12,
    zipCode: 80838,
  },
  raspberryPiId: "irgend eine raspi id",
};

export const CreateOrUpdateBoxModal: FC<CreateOrUpdateBoxModalProps> = ({
  open,
  onClose: externalOnClose,
  initialValue,
}) => {
  const { formatMessage } = useIntl();

  const [name, setName] = useState<string>();
  const [raspberryPiId, setRaspberryPiId] = useState<string>();
  const [address, setAddress] = useState<AddressInput>();

  const onClose = () => {
    setName(undefined);
    setRaspberryPiId(undefined);
    setAddress(undefined);
    externalOnClose();
  };

  useEffect(() => {
    if (initialValue) {
      setName(initialValue.name);
      setRaspberryPiId(initialValue.raspberryPiId);
      setAddress(initialValue.address);
    }
  }, [initialValue]);

  const [createBoxMutation, { isLoading: createLoading }] =
    useCreateBoxMutation();
  const [updateBoxMutation, { isLoading: updateLoading }] =
    useUpdateBoxMutation();

  const valid = name && validAddressInput(address);

  const onError = (status: number) => {
    switch (status) {
      case 409:
        message.error(
          formatMessage({
            id: "boxes.create-or-update.error.duplicate-key",
          })
        );
        break;
      default:
        message.error(formatMessage({ id: "boxes.create-or-update.error" }));
    }
  };

  const onCreateBox = () => {
    if (valid && address && raspberryPiId) {
      createBoxMutation({ name, address, raspberryPiId })
        .unwrap()
        .then(onClose)
        .catch((error) => onError(error.status));
    } else {
      message.error("All mandatory fields must be filled");
    }
  };

  const onUpdateBox = () => {
    if (
      initialValue?.id &&
      name &&
      address &&
      validateAddress(address) &&
      raspberryPiId
    ) {
      updateBoxMutation({
        id: initialValue.id,
        name,
        address,
        raspberryPiId,
      })
        .unwrap()
        .then(onClose)
        .catch((error) => {
          console.error(error);
          message.error("Box could not be updated");
        });
    } else {
      message.error("All mandatory fields must be filled");
    }
  };

  const loading = createLoading || updateLoading;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      okText={formatMessage({
        id: initialValue ? "action.update" : "action.create",
      })}
      title={formatMessage({
        id: initialValue
          ? "boxes.create-or-update.update"
          : "boxes.create-or-update.create",
      })}
      cancelButtonProps={{ loading }}
      okButtonProps={{ disabled: !valid, loading }}
      onOk={initialValue ? onUpdateBox : onCreateBox}
    >
      {false && process.env.NODE_ENV === "development" && (
        <Button
          block
          style={{ marginBottom: 20 }}
          onClick={() => {
            setName(mockBox.name);
            setRaspberryPiId(mockBox.raspberryPiId);
            setAddress(mockBox.address);
          }}
        >
          Demo Box
        </Button>
      )}
      <Form layout={"vertical"}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              required
              label={formatMessage({ id: "boxes.create-or-update.name" })}
            >
              <Input
                placeholder={formatMessage({ id: "placeholder" })}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item required label={"Raspberry Pi Id"}>
              <Input
                placeholder={formatMessage({ id: "placeholder" })}
                value={raspberryPiId}
                onChange={(e) => setRaspberryPiId(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider>
          {formatMessage({ id: "boxes.create-or-update.address" })}
        </Divider>
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              required
              label={formatMessage({
                id: "boxes.create-or-update.address.street",
              })}
            >
              <Input
                placeholder={formatMessage({
                  id: "boxes.create-or-update.address.street.placeholder",
                })}
                value={address?.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              required
              label={formatMessage({
                id: "boxes.create-or-update.address.house-number",
              })}
            >
              <InputNumber
                type={"number"}
                placeholder={formatMessage({
                  id: "boxes.create-or-update.address.house-number.placeholder",
                })}
                value={address?.houseNumber}
                onChange={(value) =>
                  setAddress({ ...address, houseNumber: value || undefined })
                }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={formatMessage({
                id: "boxes.create-or-update.address.addition",
              })}
            >
              <Input
                placeholder={formatMessage({
                  id: "boxes.create-or-update.address.addition.placeholder",
                })}
                value={address?.addition}
                onChange={(e) =>
                  setAddress({ ...address, addition: e.target.value })
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              required
              label={formatMessage({
                id: "boxes.create-or-update.address.city",
              })}
            >
              <Input
                placeholder={formatMessage({
                  id: "boxes.create-or-update.address.city.placeholder",
                })}
                value={address?.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              required
              label={formatMessage({
                id: "boxes.create-or-update.address.zip-code",
              })}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={formatMessage({
                  id: "boxes.create-or-update.address.zip-code.placeholder",
                })}
                value={address?.zipCode}
                onChange={(value) =>
                  setAddress({ ...address, zipCode: value || undefined })
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              required
              label={formatMessage({
                id: "boxes.create-or-update.address.country",
              })}
            >
              <Select
                placeholder={formatMessage({ id: "placeholder" })}
                value={address?.country}
                onChange={(value) => setAddress({ ...address, country: value })}
              >
                {Object.keys(Country).map((countryKey) => {
                  return (
                    <Option key={countryKey} value={countryKey}>
                      {
                        // @ts-ignore
                        countryFlagMap.get(Country[countryKey])
                      }{" "}
                      {formatMessage({
                        // @ts-ignore
                        id: countryLocalizationMap.get(Country[countryKey]),
                      })}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
