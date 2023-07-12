import React, { FC } from "react";
import { Modal } from "antd";
import { AseQrCode } from "../../AseQrCode";

interface DeliveryQrCodeModalProps {
  open: boolean;
  onClose: () => void;
  value: string | undefined;
}

export const DeliveryQrCodeModal: FC<DeliveryQrCodeModalProps> = ({
  value,
  open,
  onClose,
}) => (
  <Modal open={open} onCancel={onClose} footer={false}>
    <AseQrCode value={value} />
  </Modal>
);
