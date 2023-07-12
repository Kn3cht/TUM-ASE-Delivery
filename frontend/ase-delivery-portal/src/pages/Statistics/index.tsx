import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import Title from "antd/es/typography/Title";
import { Tabs } from "antd";
import { FieldNumberOutlined, PieChartOutlined } from "@ant-design/icons";
import { ChartStatistics } from "./ChartStatistics";
import { NumberStatistics } from "./NumberStatistics";

const Statistics: FC = () => {
  return (
    <PageWrapper compact>
      <Title level={3}>Statistics</Title>
      <Tabs
        defaultActiveKey="charts"
        items={[
          {
            key: "charts",
            label: (
              <span>
                <PieChartOutlined />
                Charts
              </span>
            ),
            children: <ChartStatistics />,
          },
          {
            key: "numbers",
            label: (
              <span>
                <FieldNumberOutlined />
                Statistics in numbers
              </span>
            ),
            children: <NumberStatistics />,
          },
        ]}
      />
    </PageWrapper>
  );
};

export default Statistics;
