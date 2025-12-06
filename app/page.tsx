"use client";

import { Card, Row, Col, Statistic, Button, Typography, Spin } from "antd";
import {
  UserAddOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title } = Typography;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        return;
      } else {
        router.push("/auth");
      }
    }
  }, [user, loading, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Title level={2} className="text-gray-800 m-0 text-xl sm:text-2xl">
          Dashboard
        </Title>
        {/* <div className="flex flex-wrap gap-2">
          <Link href="/customers">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="large"
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              Add Customer
            </Button>
          </Link>
          <Button
            icon={<ShoppingOutlined />}
            size="large"
            className="w-full sm:w-auto"
          >
            Create Order
          </Button>
        </div> */}
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} lg={6}>
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#faf5ff" }} // Light purple background
          >
            <Statistic
              title="Total Customers"
              value={0}
              prefix={<TeamOutlined className="text-purple-500" />}
              styles={{
                content: { color: "#7c3aed" },
              }}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#eff6ff" }} // Light blue background
          >
            <Statistic
              title="Active Orders"
              value={0}
              prefix={<ShoppingOutlined className="text-blue-500" />}
              styles={{
                content: { color: "#3b82f6" },
              }}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#fff7ed" }} // Light orange background
          >
            <Statistic
              title="Due Today"
              value={0}
              prefix={<FileTextOutlined className="text-orange-500" />}
              styles={{
                content: { color: "#f97316" },
              }}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#f0fdf4" }} // Light green background
          >
            <Statistic
              title="Delivered"
              value={0}
              prefix={<FileTextOutlined className="text-green-500" />}
              styles={{
                content: { color: "#10b981" },
              }}
              className="text-center"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card
            title="Quick Actions"
            variant={"borderless"}
            className="shadow-sm border-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                icon={<ShoppingOutlined />}
                size="large"
                className="w-full h-14 sm:h-16 text-base border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              >
                Create Order
              </Button>
              <Button
                icon={<FileTextOutlined />}
                size="large"
                className="w-full h-14 sm:h-16 text-base border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50"
              >
                Take Measurements
              </Button>
              <Button
                icon={<FileTextOutlined />}
                size="large"
                className="w-full h-14 sm:h-16 text-base border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              >
                Generate Receipt
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card
            title="Recent Activity"
            variant={"borderless"}
            className="shadow-sm border-0 h-full"
          >
            <div className="text-center py-8 sm:py-12">
              <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                No recent activity
              </p>
              <p className="text-gray-400 text-sm sm:text-base">
                Start by adding your first customer!
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
