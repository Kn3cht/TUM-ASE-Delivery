import React, { FC } from "react";
import CountUp from "react-countup";
import { Card, Col, Row, Space, Statistic } from "antd";
import { useListUsersQuery } from "../../redux/api/userApi";
import { UserRole } from "../../repository/types/user";
import Title from "antd/es/typography/Title";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CarOutlined,
  DropboxOutlined,
  LineOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useListDeliveriesQuery } from "../../redux/api/deliveryApi";
import moment from "moment";
import { useListBoxesQuery } from "../../redux/api/boxApi";

const formatter = (value: number) => <CountUp end={value} separator="," />;

const percentageIncrease = (
  prev: number | undefined,
  current: number | undefined
): number => {
  if (!prev || !current) {
    return 0;
  }
  return (current - prev) / prev;
};

export const NumberStatistics: FC = () => {
  const { data: deliveries, isLoading: deliveriesLoading } =
    useListDeliveriesQuery();
  const { data: users, isLoading: usersLoading } = useListUsersQuery();
  const { data: boxes, isLoading: boxesLoading } = useListBoxesQuery();

  const customers = users?.filter((user) => user.role === UserRole.CUSTOMER);
  const deliverers = users?.filter((user) => user.role === UserRole.DELIVERER);
  const dispatchers = users?.filter(
    (user) => user.role === UserRole.DISPATCHER
  );

  const deliveriesOfToday = deliveries?.filter(({ delivery }) =>
    moment(delivery.createdAt).isSame(moment(), "date")
  );

  const deliveriesOfYesterday = deliveries?.filter(({ delivery }) =>
    moment(delivery.createdAt).isSame(moment().add(-1, "day"), "date")
  );

  const increaseSinceYesterday = percentageIncrease(
    deliveriesOfYesterday?.length,
    deliveriesOfToday?.length
  );
  let trendIcon = <LineOutlined />;
  let trendColor: string | undefined = undefined;

  if (increaseSinceYesterday > 0) {
    trendIcon = <ArrowUpOutlined />;
    trendColor = "#3f8600";
  } else if (increaseSinceYesterday < 0) {
    trendIcon = <ArrowDownOutlined />;
    trendColor = "#cf1322";
  }

  return (
    <div>
      <Space style={{ width: "100%" }} direction={"vertical"} size={64}>
        <div>
          <Title level={4}>Deliveries and Boxes</Title>
          <Row gutter={32}>
            <Col span={8}>
              <Card>
                <Statistic
                  loading={deliveriesLoading}
                  title={<span>Total deliveries</span>}
                  value={deliveries?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  loading={deliveriesLoading}
                  valueStyle={trendColor ? { color: trendColor } : undefined}
                  prefix={trendIcon}
                  title={<span>Daily delivery trend</span>}
                  suffix="%"
                  value={increaseSinceYesterday * 100}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  loading={boxesLoading}
                  title={<span>Total boxes</span>}
                  value={boxes?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div>
          <Title level={4}>Users</Title>
          <Row gutter={32}>
            <Col span={6}>
              <Card>
                <Statistic
                  loading={usersLoading}
                  title={<span>Customers</span>}
                  prefix={<UserOutlined />}
                  value={customers?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  loading={usersLoading}
                  title={<span>Deliverers</span>}
                  prefix={<CarOutlined />}
                  value={deliverers?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  loading={usersLoading}
                  title={<span>Dispatchers</span>}
                  prefix={<DropboxOutlined />}
                  value={dispatchers?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  loading={usersLoading}
                  title="Total"
                  value={users?.length}
                  formatter={(value) => formatter(Number(value))}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Space>
    </div>
  );
};
