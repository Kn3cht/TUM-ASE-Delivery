import React, { FC } from "react";
import { useListDeliveriesQuery } from "../../redux/api/deliveryApi";
import { useListUsersQuery } from "../../redux/api/userApi";
import { Card, Col, Row, Space } from "antd";
import { Line, Pie } from "@ant-design/charts";
import { UserRole } from "../../repository/types/user";
import { DeliveryStatusTitles, UserRoleTitles } from "../../utils/enum-maps";
import { DeliveryStatus } from "../../repository/types/delivery";
import moment from "moment";

const userColorPalette = ["#EF9436", "#3a83b7", "#C35E87"];
const deliveryColorPalette = ["#B89616", "#7F9319", "#9a6b3e", "#005247"];

export const ChartStatistics: FC = () => {
  const { data: deliveryWrappers, isLoading: deliveriesLoading } =
    useListDeliveriesQuery();
  const { data: users, isLoading: usersLoading } = useListUsersQuery();

  const usersByRole: { role: string; value: number }[] = Object.keys(
    UserRole
  ).map((role) => ({
    role: UserRoleTitles.get(role as UserRole)!,
    value: users?.filter((user) => user.role === role)?.length || 0,
  }));

  const deliveries = deliveryWrappers?.map(({ delivery }) => delivery);

  const deliveriesByStatus: { status: string; value: number }[] = Object.keys(
    DeliveryStatus
  ).map((status) => ({
    status: DeliveryStatusTitles.get(status as DeliveryStatus)!,
    value:
      deliveries?.filter((delivery) => delivery.status === status)?.length || 0,
  }));

  const deliveryUnixDates = deliveries
    ?.map((delivery) => moment(delivery.createdAt).startOf("day").unix())
    ?.sort();

  const uniqueUnixDates: number[] = [];

  deliveryUnixDates?.forEach((unixDate) => {
    if (!uniqueUnixDates.includes(unixDate)) {
      uniqueUnixDates.push(unixDate);
    }
  });

  uniqueUnixDates.sort();

  const deliveriesPerDay: { date: number; value: number }[] =
    uniqueUnixDates.map((unixDate) => ({
      date: unixDate,
      value:
        deliveries?.filter(
          (delivery) =>
            moment(delivery.createdAt).startOf("day").unix() === unixDate
        )?.length || 0,
    }));

  return (
    <div>
      <Space style={{ width: "100%" }} direction={"vertical"} size={64}>
        <Row gutter={32}>
          <Col span={12}>
            <Card>
              <b>User role distribution</b>
              <Pie
                color={userColorPalette}
                loading={usersLoading}
                angleField={"value"}
                colorField={"role"}
                data={usersByRole || []}
                interactions={[
                  { type: "element-selected" },
                  { type: "element-active" },
                ]}
              />
              <span>Total users: {users?.length || 0}</span>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <b>Deliveries by status</b>
              <Pie
                color={deliveryColorPalette}
                loading={deliveriesLoading}
                angleField={"value"}
                colorField={"status"}
                data={deliveriesByStatus || []}
                interactions={[
                  { type: "element-selected" },
                  { type: "element-active" },
                ]}
              />
              <span>Total deliveries: {deliveries?.length || 0}</span>
            </Card>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={24}>
            <Card>
              <b>Delivery trend</b>
              <Line
                padding={"auto"}
                style={{ marginTop: 20 }}
                point={{
                  size: 2,
                  shape: "circle",
                }}
                tooltip={{
                  title: (datum) =>
                    moment(new Date(Number(datum) * 1000)).format("DD.MM.YYYY"),
                  formatter: (datum) => ({
                    name: "#Deliveries",
                    value: datum.value,
                  }),
                }}
                annotations={[
                  {
                    type: "text",
                    position: ["min", "median"],
                    content: "Median",
                    offsetY: -4,
                    offsetX: -10,
                    style: {
                      textBaseline: "bottom",
                    },
                  },
                  {
                    type: "regionFilter",
                    start: ["min", "median"],
                    end: ["max", "0"],
                    color: "#F4664A",
                  },
                  {
                    type: "line",
                    start: ["min", "median"],
                    end: ["max", "median"],
                    style: {
                      stroke: "#F4664A",
                      lineDash: [2, 2],
                    },
                  },
                ]}
                xAxis={{
                  label: {
                    formatter: (text) =>
                      moment(new Date(Number(text) * 1000)).format(
                        "DD.MM.YYYY"
                      ),
                  },
                }}
                loading={deliveriesLoading}
                data={deliveriesPerDay || []}
                xField={"date"}
                yField={"value"}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
