import {
  Button,
  Input,
  Row,
  Col,
  Typography,
  Select,
  Badge,
  Dropdown,
  MenuProps,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { OrderStatus, Order } from "./types";

const { Title } = Typography;

interface OrdersHeaderProps {
  onAddOrder: () => void;
  searchText: string;
  onSearch: (value: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusFilter: (status: OrderStatus | "all") => void;
  orders: Order[]; // Add orders to calculate counts
}

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  cutting: "Cutting",
  stitching: "Stitching",
  finishing: "Finishing",
  ready: "Ready",
  delivered: "Delivered",
};

const statusColors: Record<OrderStatus, string> = {
  new: "blue",
  cutting: "orange",
  stitching: "volcano",
  finishing: "gold",
  ready: "green",
  delivered: "cyan",
};

export default function OrdersHeader({
  onAddOrder,
  searchText,
  onSearch,
  statusFilter,
  onStatusFilter,
  orders,
}: OrdersHeaderProps) {
  // Calculate status counts
  const statusCounts = () => {
    const counts: Record<OrderStatus, number> = {
      new: 0,
      cutting: 0,
      stitching: 0,
      finishing: 0,
      ready: 0,
      delivered: 0,
    };

    orders.forEach((order) => {
      counts[order.status]++;
    });

    return counts;
  };

  const counts = statusCounts();
  const totalOrders = orders.length;

  // Create dropdown menu items with counts - properly typed for Ant Design
  const filterMenuItems: MenuProps["items"] = [
    {
      key: "all",
      label: (
        <div className="flex justify-between items-center py-2 px-1 min-w-48">
          <span className="font-medium">All Orders</span>
          <Badge
            count={totalOrders}
            showZero
            color="#7c3aed"
            className="font-semibold"
          />
        </div>
      ),
      onClick: () => onStatusFilter("all"),
    },
    {
      type: "divider" as const, // Use 'as const' to fix the type
    },
    ...Object.entries(counts).map(([status, count]) => ({
      key: status,
      label: (
        <div className="flex justify-between items-center py-2 px-1 min-w-48">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: statusColors[status as OrderStatus] }}
            />
            <span className="capitalize">
              {statusLabels[status as OrderStatus]}
            </span>
          </div>
          <Badge
            count={count}
            showZero
            color={statusColors[status as OrderStatus]}
            className="font-semibold"
          />
        </div>
      ),
      onClick: () => onStatusFilter(status as OrderStatus),
    })),
  ];

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} md={12}>
        <div>
          <Title level={2} className="m-0">
            Orders
          </Title>
          <p className="text-gray-600 m-0">
            Track and manage all clothing orders
          </p>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            size="large"
            allowClear
            className="flex-1"
          />

          {/* Custom Dropdown Filter with Counts */}
          <Dropdown
            menu={{ items: filterMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type={statusFilter === "all" ? "default" : "primary"}
              icon={<FilterOutlined />}
              size="large"
              className="flex items-center justify-between min-w-40"
            >
              <span className="truncate">
                {statusFilter === "all"
                  ? "All Orders"
                  : statusLabels[statusFilter as OrderStatus]}
              </span>
              <DownOutlined className="ml-2" />
            </Button>
          </Dropdown>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={onAddOrder}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 whitespace-nowrap"
          >
            New Order
          </Button>
        </div>

        {/* Current Filter Display */}
        {statusFilter !== "all" && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: statusColors[statusFilter as OrderStatus],
                }}
              />
              <span className="font-medium">
                {statusLabels[statusFilter as OrderStatus]}:
              </span>
              <span className="font-bold">
                {counts[statusFilter as OrderStatus]} orders
              </span>
            </div>
            <Button
              type="link"
              size="small"
              onClick={() => onStatusFilter("all")}
              className="text-gray-500"
            >
              Clear filter
            </Button>
          </div>
        )}

        {/* Total count summary */}
        <div className="mt-2 text-sm text-gray-600">
          Total: <span className="font-semibold">{totalOrders}</span> orders
        </div>
      </Col>
    </Row>
  );
}
