/* eslint-disable */
import { Row, Col, Card, Tag } from "antd";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  ScissorOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { OrderStats } from "./types";

interface OrdersStatsProps {
  stats: OrderStats;
}

const statConfigs = [
  {
    key: "total" as const,
    label: "Total",
    icon: <ShoppingOutlined />,
    color: "purple",
  },
  {
    key: "new" as const,
    label: "New",
    icon: <ClockCircleOutlined />,
    color: "blue",
  },
  {
    key: "cutting" as const,
    label: "Cutting",
    icon: <ScissorOutlined />,
    color: "orange",
  },
  {
    key: "stitching" as const,
    label: "Stitching",
    icon: <ToolOutlined />,
    color: "volcano",
  },
  {
    key: "finishing" as const,
    label: "Finishing",
    icon: <ToolOutlined />,
    color: "gold",
  },
  {
    key: "ready" as const,
    label: "Ready",
    icon: <CheckCircleOutlined />,
    color: "green",
  },
  {
    key: "delivered" as const,
    label: "Delivered",
    icon: <RocketOutlined />,
    color: "cyan",
  },
];

export default function OrdersStats({ stats }: OrdersStatsProps) {
  return (
    <Row gutter={[8, 8]}>
      {statConfigs.map(({ key, label, icon, color }) => (
        <Col xs={12} sm={8} md={6} lg={3} key={key}>
          <Card size="small" className="text-center">
            <div className="space-y-1">
              <div className={`text-2xl font-bold text-${color}-600`}>
                {stats[key]}
              </div>
              <Tag icon={icon} color={color} className="m-0 text-xs px-2 py-1">
                {label}
              </Tag>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
