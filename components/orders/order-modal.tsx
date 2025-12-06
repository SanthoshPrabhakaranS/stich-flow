import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Divider,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Tag,
  Alert,
  Collapse,
  App,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
  HistoryOutlined,
  IdcardOutlined,
  DownOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Order, OrderFormValues, OrderStatus } from "./types";
import { generateCustomerId, findCustomerByPhone } from "./utils/helpers";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import MeasurementsInput from "./measurements-input";
import { Ruler } from "lucide-react";
import { OrderService } from "@/services/order-services";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

interface OrderModalProps {
  visible: boolean;
  editingOrder: Order | null;
  existingOrders: Order[];
  onCancel: () => void;
  onCreate: (order: Order) => void; // Changed to accept full Order object
  onUpdate: (order: Order) => void; // Changed to accept full Order object
}

const itemTypes = [
  "Kurti",
  "Blouse",
  "Lehenga",
  "Gown",
  "Skirt",
  "Saree",
  "Dress",
  "Top",
  "Other",
];

const statusOptions: OrderStatus[] = [
  "new",
  "cutting",
  "stitching",
  "finishing",
  "ready",
  "delivered",
];

export default function OrderModal({
  visible,
  editingOrder,
  existingOrders,
  onCancel,
  onCreate,
  onUpdate,
}: OrderModalProps) {
  const [form] = Form.useForm();
  const [customerId, setCustomerId] = useState<string>("");
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState<Order | null>(null);
  const [activePanels, setActivePanels] = useState<string[]>([
    "customer",
    "order",
    "measurements",
    "notes",
  ]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    if (visible && !editingOrder) {
      const newCustomerId = generateCustomerId(existingOrders);
      setCustomerId(newCustomerId);
    } else if (editingOrder) {
      setCustomerId(editingOrder.customer_id);
    }
  }, [visible, editingOrder, existingOrders]);

  const handleSubmit = async (values: OrderFormValues) => {
    setLoading(true);
    try {
      const orderData = {
        customer_id: customerId,
        customer_name: values.customer_name,
        customer_phone: values.customer_phone,
        customer_address: values.customer_address || "",
        item_type: values.item_type,
        due_date: values.due_date.format("YYYY-MM-DD"),
        stitching_price: values.stitching_price,
        material_price: values.material_price || 0,
        status: values.status,
        measurements: values.measurements || {},
        notes: values.notes || "",
      };

      if (editingOrder) {
        // Update existing order in Supabase
        const updatedOrder = await OrderService.updateOrder(
          editingOrder.id,
          orderData
        );
        onUpdate(updatedOrder);
        message.success("Order updated successfully!");
      } else {
        // Create new order in Supabase
        const newOrder = await OrderService.createOrder(orderData);
        onCreate(newOrder);
        message.success("Order created successfully!");
      }

      handleCancel();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error saving order:", error);
      message.error(error.message || "Failed to save order");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (phone: string) => {
    if (phone.length >= 10) {
      const existingCustomer = findCustomerByPhone(existingOrders, phone);
      if (existingCustomer && !editingOrder) {
        setExistingCustomer(existingCustomer);
        setIsReturningCustomer(true);
        setCustomerId(existingCustomer.customer_id);
        form.setFieldsValue({
          customer_name: existingCustomer.customer_name,
          customer_address: existingCustomer.customer_address,
        });
      } else {
        setExistingCustomer(null);
        setIsReturningCustomer(false);
        if (!editingOrder) {
          const newCustomerId = generateCustomerId(existingOrders);
          setCustomerId(newCustomerId);
        }
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCustomerId("");
    setIsReturningCustomer(false);
    setExistingCustomer(null);
    onCancel();
  };

  const handlePanelChange = (keys: string[] | string) => {
    setActivePanels(typeof keys === "string" ? [keys] : keys);
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold">
          {editingOrder ? "Edit Order" : "Create New Order"}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      style={{ top: 20 }}
      maskClosable={!loading}
      closable={!loading}
    >
      <Divider />

      {/* Customer ID Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-3">
          <IdcardOutlined className="text-purple-600 text-xl" />
          <div className="flex flex-row items-center gap-2">
            <div className="font-medium text-gray-700">Customer ID</div>
            <div className="flex items-center space-x-3">
              <Tag color="purple" className="text-lg font-bold px-3 py-1">
                {customerId}
              </Tag>
              {isReturningCustomer && (
                <Tag
                  color="green"
                  icon={<HistoryOutlined />}
                  className="px-3 py-1"
                >
                  Returning Customer
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={
          editingOrder
            ? {
                ...editingOrder,
                due_date: dayjs(editingOrder.due_date),
                measurements: editingOrder.measurements || {},
                material_price: editingOrder.material_price || 0,
                customer_address: editingOrder.customer_address || "",
                notes: editingOrder.notes || "",
              }
            : { measurements: {}, status: "new", material_price: 0 }
        }
        className="mt-4"
      >
        <Collapse
          activeKey={activePanels}
          onChange={handlePanelChange}
          bordered={false}
          expandIcon={({ isActive }) => (
            <DownOutlined
              className={`transform transition-transform duration-200 ${
                isActive ? "rotate-180" : ""
              } text-white`}
            />
          )}
          className="custom-purple-collapse space-y-3"
        >
          {/* Customer Information Panel */}
          <Panel
            header={
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-white" />
                <span className="text-white font-medium">
                  Customer Information
                </span>
              </div>
            }
            key="customer"
            className="!border-0 !rounded-lg"
          >
            <div className=" py-2 bg-gray-50 rounded-lg">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="customer_name"
                    label="Customer Name"
                    rules={[
                      { required: true, message: "Please enter customer name" },
                    ]}
                  >
                    <Input
                      placeholder="Enter customer name"
                      size="large"
                      prefix={<UserOutlined className="text-gray-400" />}
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="customer_phone"
                    label="Phone Number"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter phone number"
                      size="large"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="customer_address" label="Address">
                <TextArea
                  placeholder="Enter customer address (optional)"
                  rows={2}
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              {isReturningCustomer && existingCustomer && (
                <Alert
                  message="Returning Customer Found"
                  description={
                    <div>
                      <p>This customer has previous orders in the system.</p>
                      <div className="mt-2 text-sm">
                        <strong>Previous Order:</strong>{" "}
                        {existingCustomer.item_type}
                        (₹
                        {existingCustomer.stitching_price +
                          existingCustomer.material_price}
                        )
                      </div>
                    </div>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />
              )}
            </div>
          </Panel>

          {/* Order Details Panel */}
          <Panel
            header={
              <div className="flex items-center space-x-2">
                <ShoppingOutlined className="text-white" />
                <span className="text-white font-medium">Order Details</span>
              </div>
            }
            key="order"
            className="!border-0 !rounded-lg"
          >
            <div className="py-2 bg-gray-50 rounded-lg">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="item_type"
                    label="Item Type"
                    rules={[
                      { required: true, message: "Please select item type" },
                    ]}
                  >
                    <Select
                      placeholder="Select item type"
                      size="large"
                      suffixIcon={
                        <ShoppingOutlined className="text-gray-400" />
                      }
                      disabled={loading}
                    >
                      {itemTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="due_date"
                    label="Due Date"
                    rules={[
                      { required: true, message: "Please select due date" },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select due date"
                      size="large"
                      className="w-full"
                      suffixIcon={
                        <CalendarOutlined className="text-gray-400" />
                      }
                      format="DD/MM/YYYY"
                      disabled={loading}
                      disabledDate={(current) => {
                        // Can't select dates before today
                        return current && current < dayjs().startOf("day");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Select
                      placeholder="Select status"
                      size="large"
                      disabled={loading}
                    >
                      {statusOptions.map((status) => (
                        <Option key={status} value={status}>
                          <span className="capitalize">{status}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="stitching_price"
                    label="Stitching Price (₹)"
                    rules={[
                      {
                        required: true,
                        message: "Please enter stitching price",
                      },
                      {
                        type: "number",
                        min: 0,
                        message: "Price must be 0 or greater",
                      },
                    ]}
                  >
                    <InputNumber<number>
                      placeholder="Enter stitching price"
                      size="large"
                      style={{ width: "100%" }}
                      min={0}
                      disabled={loading}
                      formatter={(value) =>
                        `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        Number(value?.replace(/₹\s?|(,*)/g, ""))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="material_price"
                    label="Material Price (₹)"
                    rules={[
                      {
                        type: "number",
                        min: 0,
                        message: "Price must be 0 or greater",
                      },
                    ]}
                  >
                    <InputNumber<number>
                      placeholder="Enter material price"
                      size="large"
                      style={{ width: "100%" }}
                      min={0}
                      disabled={loading}
                      formatter={(value) =>
                        `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        Number(value?.replace(/₹\s?|(,*)/g, ""))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Panel>

          {/* Measurements Panel */}
          <Panel
            header={
              <div className="flex items-center space-x-2">
                <Ruler className="text-white" />
                <span className="text-white font-medium">Measurements</span>
              </div>
            }
            key="measurements"
            className="!border-0 !rounded-lg"
          >
            <div className="py-4 bg-gray-50 rounded-lg">
              <MeasurementsInput form={form} disabled={loading} />
            </div>
          </Panel>

          {/* Notes Panel */}
          <Panel
            header={
              <div className="flex items-center space-x-2">
                <FileTextOutlined className="text-white" />
                <span className="text-white font-medium">Additional Notes</span>
              </div>
            }
            key="notes"
            className="!border-0 !rounded-lg"
          >
            <div className="py-4 bg-gray-50 rounded-lg">
              <Form.Item name="notes" label="Notes (Optional)">
                <TextArea
                  placeholder="Enter any additional notes or special instructions..."
                  rows={3}
                  size="large"
                  disabled={loading}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </div>
          </Panel>
        </Collapse>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <Button
            onClick={handleCancel}
            size="large"
            className="px-8"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 px-8"
            loading={loading}
            disabled={loading}
          >
            {editingOrder ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .custom-purple-collapse .ant-collapse-item {
          border: none !important;
          margin-bottom: 8px !important;
        }

        .custom-purple-collapse .ant-collapse-header {
          background-color: #7c3aed !important; /* purple-600 */
          color: white !important;
          border-radius: 8px !important;
          padding: 16px 20px !important;
          border: none !important;
        }

        .custom-purple-collapse .ant-collapse-header:hover {
          background-color: #6d28d9 !important; /* purple-700 */
        }

        .custom-purple-collapse .ant-collapse-expand-icon {
          color: white !important;
        }

        .custom-purple-collapse .ant-collapse-content {
          border: none !important;
          border-radius: 0 0 8px 8px !important;
          padding: 0 !important;
        }

        .custom-purple-collapse .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}</style>
    </Modal>
  );
}
