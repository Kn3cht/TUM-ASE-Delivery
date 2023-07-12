import React, { FC, useEffect, useState } from "react";
import { PageWrapper } from "../../../components/PageWrapper";
import { Button, Card, message, Space, StepProps, Steps } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { Box } from "../../../repository/types/box";
import { User, UserRole } from "../../../repository/types/user";
import { DeliveryBox } from "./DeliveryBox";
import { DeliveryCustomer } from "./DeliveryCustomer";
import { DeliverySummary } from "./DeliverySummary";
import { DeliveryDeliverer } from "./DeliveryDeliverer";
import {
  CarOutlined,
  CheckCircleOutlined,
  DropboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {
  useCreateDeliveryMutation,
  useLazyGetDeliveryQuery,
  useUpdateDeliveryMutation,
} from "../../../redux/api/deliveryApi";
import { DeliveryQrCodeModal } from "../DeliveryQrCodeModal";
import { AseRoute } from "../../../utils/auth";
import { useLazyGetBoxQuery } from "../../../redux/api/boxApi";
import {
  useLazyCurrentUserQuery,
  useLazyGetUserByEmailQuery,
} from "../../../redux/api/userApi";

const DeliveryConfig: FC = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [fetchCurrentUser] = useLazyCurrentUserQuery();

  const handleAuthorization = (userRole: UserRole | undefined) => {
    if (!userRole) {
      message.info("Login required");
      navigate(AseRoute.LOGIN + "?destination=" + pathname);
    } else if (userRole !== UserRole.DISPATCHER) {
      navigate(AseRoute.FORBIDDEN);
    }
  };

  // only dispatchers are allowed to access this route
  useEffect(() => {
    fetchCurrentUser()
      .unwrap()
      .then((user) => {
        handleAuthorization(user?.role);
      })
      // user might not be logged in
      .catch(() => handleAuthorization(undefined));
  }, []);

  const [createDeliveryMutation] = useCreateDeliveryMutation();
  const [updateDeliveryMutation] = useUpdateDeliveryMutation();

  const [step, setStep] = useState<number>(0);

  const [box, setBox] = useState<Box>();
  const [customer, setCustomer] = useState<User>();
  const [deliverer, setDeliverer] = useState<User>();

  const [
    getDeliveryByIdQuery,
    { isLoading: deliveryLoading, data: deliveryWrapper },
  ] = useLazyGetDeliveryQuery();

  const delivery = deliveryWrapper?.delivery;

  const [getBoxQuery, { isLoading: boxLoading }] = useLazyGetBoxQuery();
  const [getCustomerByEmailQuery, { isLoading: customerLoading }] =
    useLazyGetUserByEmailQuery();
  const [getDelivererByEmailQuery, { isLoading: delivererLoading }] =
    useLazyGetUserByEmailQuery();

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (id) {
      getDeliveryByIdQuery(id)
        .unwrap()
        .then(({ delivery }) => {
          // Obtain box and set state
          getBoxQuery(delivery.boxId)
            .unwrap()
            .then(setBox)
            .catch((error) => {
              console.error(error);
              message.error("Box could not be fetched");
            });
          // Obtain customer and set state
          getCustomerByEmailQuery(delivery.customerEmail)
            .unwrap()
            .then(setCustomer)
            .catch((error) => {
              console.error(error);
              message.error("Customer could not be fetched");
            });
          // Obtain deliverer and set state
          getDelivererByEmailQuery(delivery.courierEmail)
            .unwrap()
            .then(setDeliverer)
            .catch((error) => {
              console.error(error);
              message.error("Deliverer could not be fetched");
            });
        })
        .catch((error) => {
          console.error(error);
          message.error("Delivery could not be loaded");
        });
    }
  }, [id]);

  const [qrCodeModalOpen, setQrCodeModalOpen] = useState<boolean>(false);
  const [trackingUrl, setTrackingUrl] = useState<string>();

  const createDelivery = () => {
    if (box?.id && customer?.email && deliverer?.email) {
      createDeliveryMutation({
        boxId: box.id,
        courierEmail: deliverer.email,
        customerEmail: customer.email,
      })
        .unwrap()
        .then((data) => {
          const trackUrl = data.trackUrl;
          message.info("Delivery was created");
          setTrackingUrl(trackUrl);
          setQrCodeModalOpen(true);
        })
        .catch((error) => {
          console.error(error);
          message.error("The delivery could not be created");
        });
    } else {
      message.error("Not all steps are filled out correctly");
    }
  };

  const updateDelivery = () => {
    if (delivery?.id && box?.id && customer?.email && deliverer?.email) {
      updateDeliveryMutation({
        id: delivery.id,
        boxId: box.id,
        courierEmail: deliverer.email,
        customerEmail: customer.email,
      })
        .unwrap()
        .then(() => {
          message.info("Delivery was updated");
          navigate(AseRoute.DELIVERIES);
        })
        .catch((error) => {
          console.error(error);
          message.error("The delivery could not be updated");
        });
    } else {
      message.error("Not all steps are filled out correctly");
    }
  };

  const validSteps = (): number[] => {
    let ret: number[] = [0];
    if (customer?.id) {
      ret.push(1);
    }
    if (box?.id) {
      ret.push(2);
    }
    if (deliverer?.id) {
      ret.push(3);
    }
    return ret;
  };

  const handlePrevious = () => {
    if (step === 0) {
      navigate("/deliveries");
    } else {
      setStep(() => step - 1);
    }
  };

  const steps: StepProps[] = [
    {
      title: "Customer",
      description: "Select customer",
      icon: <UserOutlined />,
    },
    {
      title: "Box",
      description: "Box configuration",
      icon: <DropboxOutlined />,
    },
    {
      title: "Deliverer",
      description: "Select deliverer",
      icon: <CarOutlined />,
    },
    {
      title: "Summary",
      description: "Double check",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      if (delivery?.id) {
        updateDelivery();
      } else {
        createDelivery();
      }
    } else {
      setStep(() => step + 1);
    }
  };

  let content: React.ReactNode;

  switch (step) {
    case 0:
      content = <DeliveryCustomer customer={customer} onUpdate={setCustomer} />;
      break;
    case 1:
      content = (
        <DeliveryBox
          customerEmail={customer!.email!}
          box={box}
          onUpdate={setBox}
        />
      );
      break;
    case 2:
      content = (
        <DeliveryDeliverer deliverer={deliverer} onUpdate={setDeliverer} />
      );
      break;
    case 3:
      content = (
        <DeliverySummary customer={customer} box={box} deliverer={deliverer} />
      );
      break;
  }

  const loading =
    deliveryLoading || boxLoading || customerLoading || delivererLoading;

  return (
    <PageWrapper compact loading={loading}>
      <Space style={{ width: "100%" }} direction={"vertical"} size={16}>
        <Title level={4}>Delivery configuration</Title>
        <Card>
          <Steps
            current={step}
            onChange={setStep}
            items={steps.map((step, index) => ({
              ...step,
              disabled: !validSteps().includes(index),
            }))}
          />
        </Card>
        {content}
        <Card style={{ textAlign: "right" }}>
          <Space>
            <Button
              disabled={!validSteps().includes(step - 1) && step !== 0}
              onClick={handlePrevious}
            >
              {step === 0 ? "Cancel" : "Previous"}
            </Button>
            <Button
              disabled={
                !validSteps().includes(step + 1) && step !== steps.length - 1
              }
              type={"primary"}
              onClick={handleNext}
            >
              {step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Space>
        </Card>
      </Space>
      <DeliveryQrCodeModal
        open={qrCodeModalOpen}
        onClose={() => {
          setQrCodeModalOpen(false);
          navigate(AseRoute.DELIVERIES);
        }}
        value={trackingUrl}
      />
    </PageWrapper>
  );
};

export default DeliveryConfig;
