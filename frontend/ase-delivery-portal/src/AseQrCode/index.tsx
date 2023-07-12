import React, { FC, useRef } from "react";
import QRCode from "react-qr-code";
import { Button, Col, Row, Spin, Tooltip } from "antd";
import styles from "./ase-qr-code.module.scss";
import ReactToPrint from "react-to-print";
import { CopyOutlined, PrinterOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface AseQrCodeProps {
  value: string | undefined;
  small?: boolean;
}

export const AseQrCode: FC<AseQrCodeProps> = ({ value, small }) => {
  const componentRef = useRef();

  return (
    <div>
      <Spin spinning={!value}>
        <Row>
          <Col span={24}>
            <div // @ts-ignore
              ref={componentRef}
              className={styles.qrCodeWrapper}
            >
              <QRCode
                size={small ? 100 : undefined}
                value={value || "no-value"}
              />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 40 }} gutter={32}>
          <Col span={12}>
            <Tooltip title={"Copies the qr-code value to the clipboard."}>
              <CopyToClipboard text={value || ""}>
                <Button block icon={<CopyOutlined />}>
                  Copy to clipboard
                </Button>
              </CopyToClipboard>
            </Tooltip>
          </Col>
          <Col span={12}>
            <ReactToPrint
              trigger={() => (
                <Button type={"primary"} block icon={<PrinterOutlined />}>
                  Print
                </Button>
              )}
              // @ts-ignore
              content={() => componentRef.current}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
