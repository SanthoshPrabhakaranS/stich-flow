import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Card,
  Space,
  Tag,
  Popconfirm,
  Dropdown,
  Modal,
  Descriptions,
  Divider,
  Typography,
  App,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  FileTextOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Order, OrderStatus } from "./types";
import { Ruler } from "lucide-react";
import html2canvas from "html2canvas";
import Receipt from "../receipt";

const { Title, Text } = Typography;

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

const statusColors: Record<OrderStatus, string> = {
  new: "blue",
  cutting: "orange",
  stitching: "volcano",
  finishing: "gold",
  ready: "green",
  delivered: "cyan",
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Mark as New" },
  { value: "cutting", label: "Mark as Cutting" },
  { value: "stitching", label: "Mark as Stitching" },
  { value: "finishing", label: "Mark as Finishing" },
  { value: "ready", label: "Mark as Ready" },
  { value: "delivered", label: "Mark as Delivered" },
];

export default function OrdersTable({
  orders,
  loading,
  onEdit,
  onDelete,
  onStatusUpdate,
}: OrdersTableProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { message } = App.useApp();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleDownloadReceipt = async () => {
    if (!selectedOrder) return;

    try {
      message.loading({
        content: "Generating receipt...",
        key: "receipt",
        duration: 0,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (receiptRef.current) {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = image;
        link.download = `receipt-${selectedOrder.customer_name}-${selectedOrder.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        message.success({
          content: "Receipt downloaded successfully!",
          key: "receipt",
        });
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      message.error({ content: "Failed to download receipt", key: "receipt" });
    }
  };

  const handleShareReceipt = async () => {
    if (!selectedOrder) return;

    try {
      message.loading({
        content: "Preparing receipt for sharing...",
        key: "share",
        duration: 0,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (receiptRef.current) {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `receipt-${selectedOrder.customer_name}.png`,
              { type: "image/png" }
            );

            if (navigator.share && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: `Order Receipt - ${selectedOrder.customer_name}`,
                  text: `Order receipt for ${selectedOrder.item_type} from StichFlow Boutique`,
                });
                message.success({
                  content: "Receipt shared successfully!",
                  key: "share",
                });
              } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                  throw error;
                }
              }
            } else {
              handleDownloadReceipt();
            }
          }
        }, "image/png");
      }
    } catch (error) {
      console.error("Error sharing receipt:", error);
      message.error({ content: "Failed to share receipt", key: "share" });
    }
  };

  const handleShowReceipt = () => {
    setReceiptModalVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name, record) => (
        <Space orientation="vertical" size={0}>
          <Space>
            <UserOutlined style={{ color: "#7c3aed" }} />
            <span className="font-medium">{name}</span>
          </Space>
          <span className="text-xs text-gray-500">{record.customer_phone}</span>
        </Space>
      ),
    },
    {
      title: "Item Type",
      dataIndex: "item_type",
      key: "item_type",
      render: (type) => <Tag color="purple">{type}</Tag>,
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      responsive: ["md"],
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#7c3aed" }} />
          {new Date(date).toLocaleDateString()}
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "stitching_price",
      key: "price",
      responsive: ["md"],
      render: (_, record) => (
        <Space>₹{record.stitching_price + record.material_price}</Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Dropdown
            menu={{
              items: statusOptions.map((option) => ({
                key: option.value,
                label: option.label,
                onClick: () => onStatusUpdate(record.id, option.value),
              })),
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className="hover:text-red-700"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Clean Mobile Loader
  const renderMobileLoader = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Spin size="large" className="mb-4" />
      <Title level={4} className="text-gray-700 mb-2">
        Loading Orders
      </Title>
      <Text type="secondary" className="text-gray-500">
        Please wait while we fetch your orders...
      </Text>
    </div>
  );

  // Enhanced Mobile Card View
  const renderMobileView = () => {
    if (loading) {
      return renderMobileLoader();
    }

    if (orders.length === 0) {
      return (
        <Card className="text-center py-8 shadow-sm">
          <div className="flex flex-col items-center">
            <FileTextOutlined className="text-gray-400 text-4xl mb-4" />
            <Title level={4} className="text-gray-700 mb-2">
              No orders found
            </Title>
            <Text type="secondary" className="text-gray-500">
              No orders match your current filters
            </Text>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4 flex flex-col gap-2">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => handleCardClick(order)}
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <div className="space-y-3">
              {/* Header with Status Badge */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserOutlined className="text-purple-600 text-lg" />
                    <Title level={5} className="m-0 text-gray-800">
                      {order.customer_name}
                    </Title>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhoneOutlined />
                    <span>{order.customer_phone}</span>
                  </div>
                </div>
                <Tag
                  color={statusColors[order.status]}
                  className="capitalize font-semibold px-3 py-1 text-sm"
                >
                  {order.status}
                </Tag>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Item:</span>
                  <Tag color="purple" className="font-semibold">
                    {order.item_type}
                  </Tag>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Due Date:</span>
                  <div className="flex items-center space-x-1 text-orange-600">
                    <CalendarOutlined />
                    <span className="font-semibold">
                      {new Date(order.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total Price:
                  </span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <span className="font-bold text-lg">
                      ₹{order.stitching_price + order.material_price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <Dropdown
                  menu={{
                    items: statusOptions.map((option) => ({
                      key: option.value,
                      label: option.label,
                      onClick: (e) => {
                        e.domEvent.stopPropagation();
                        onStatusUpdate(order.id, option.value);
                      },
                    })),
                  }}
                  trigger={["click"]}
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Status
                  </Button>
                </Dropdown>

                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(order);
                    }}
                    size="small"
                    className="text-blue-600"
                  />
                  <Popconfirm
                    title="Delete Order"
                    description="Are you sure you want to delete this order?"
                    onConfirm={(e) => {
                      if (e) e.stopPropagation();
                      onDelete(order.id);
                    }}
                    okText="Yes"
                    cancelText="No"
                    okType="danger"
                    onPopupClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </Space>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Clean Desktop Loader
  const renderDesktopLoader = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Spin size="large" className="mb-6" />
      <Title level={3} className="text-gray-800 mb-3">
        Loading Orders
      </Title>
      <Text type="secondary" className="text-gray-600 text-base">
        Please wait while we fetch your orders from the database...
      </Text>
    </div>
  );

  // Desktop Table with separate loader and empty state
  const renderDesktopView = () => {
    if (loading) {
      return renderDesktopLoader();
    }

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTextOutlined className="text-gray-400 text-5xl mb-6" />
          <Title level={3} className="text-gray-800 mb-3">
            No orders found
          </Title>
          <Text type="secondary" className="text-gray-600 text-base mb-6">
            No orders match your current search or filter criteria
          </Text>
        </div>
      );
    }

    return (
      <Table
        columns={columns}
        dataSource={orders}
        loading={false} // Set to false since we handle loading above
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
        scroll={{ x: 800 }}
      />
    );
  };

  // Order Detail Modal
  const renderDetailModal = () => (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <FileTextOutlined className="text-purple-600" />
          <span>Order Details</span>
        </div>
      }
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      footer={null}
      width={400}
    >
      {selectedOrder && (
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <Title level={5} className="m-0 mb-2 text-purple-800">
              Customer Information
            </Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">
                {selectedOrder.customer_name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.customer_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedOrder.customer_address || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer ID">
                <Tag color="purple">{selectedOrder.customer_id}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Order Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Title level={5} className="m-0 mb-2 text-blue-800">
              Order Details
            </Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Item Type">
                <Tag color="purple">{selectedOrder.item_type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {new Date(selectedOrder.due_date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={statusColors[selectedOrder.status]}
                  className="capitalize"
                >
                  {selectedOrder.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Stitching Price">
                ₹{selectedOrder.stitching_price}
              </Descriptions.Item>
              <Descriptions.Item label="Material Price">
                ₹{selectedOrder.material_price}
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <Text strong className="text-green-600 text-lg">
                  ₹
                  {selectedOrder.stitching_price + selectedOrder.material_price}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Measurements */}
          {selectedOrder.measurements &&
            Object.keys(selectedOrder.measurements).length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <Title
                  level={5}
                  className="m-0 mb-2 text-orange-800 flex items-center"
                >
                  <Ruler className="mr-2" />
                  Measurements
                </Title>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(selectedOrder.measurements).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize text-gray-600">
                            {key.replace("_", " ")}:
                          </span>
                          <span className="font-semibold">{value}&apos;</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

          {/* Notes */}
          {selectedOrder.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="m-0 mb-2">
                Notes
              </Title>
              <Text>{selectedOrder.notes}</Text>
            </div>
          )}

          <Divider />

          {/* Preview Button */}
          <Button
            type="dashed"
            icon={<FileTextOutlined />}
            onClick={handleShowReceipt}
            className="w-full mt-2"
            size="large"
          >
            Preview Receipt
          </Button>
        </div>
      )}
    </Modal>
  );

  const renderReceiptModal = () => (
    <Modal
      title="Receipt Preview"
      open={receiptModalVisible}
      onCancel={() => setReceiptModalVisible(false)}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadReceipt}
        >
          Download
        </Button>,
        <Button
          key="share"
          icon={<ShareAltOutlined />}
          onClick={handleShareReceipt}
        >
          Share
        </Button>,
      ]}
      width={400}
    >
      {selectedOrder && (
        <div ref={receiptRef}>
          <Receipt order={selectedOrder} />
        </div>
      )}
    </Modal>
  );

  return (
    <>
      {isMobile ? (
        <>
          {renderMobileView()}
          {renderDetailModal()}
          {renderReceiptModal()}
        </>
      ) : (
        <>
          {renderDesktopView()}
          {renderDetailModal()}
          {renderReceiptModal()}
        </>
      )}
    </>
  );
}
