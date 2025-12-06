"use client";

import { useState, useEffect } from "react";
import {
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { ConfigProvider, Layout, Menu, Button, Drawer, Divider } from "antd";
import { useAuth } from "@/contexts/auth-context";
import CustomLogo from "../logo/logo";

const { Sider, Content } = Layout;

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined className="text-base" />,
      label: (
        <Link href="/" className="text-gray-700 hover:text-purple-600 ml-2">
          Dashboard
        </Link>
      ),
    },
    {
      key: "orders",
      icon: <ShoppingOutlined className="text-base" />,
      label: (
        <Link
          href="/orders"
          className="text-gray-700 hover:text-purple-600 ml-2"
        >
          Orders
        </Link>
      ),
    },
    {
      key: "measurements",
      icon: <FileTextOutlined className="text-base" />,
      label: (
        <Link
          href="/measurements"
          className="text-gray-700 hover:text-purple-600 ml-2"
        >
          Measurements
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderMenu = () => (
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]}
      items={menuItems}
      className="custom-sidebar-menu"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
      }}
      onClick={() => {
        if (isMobile) {
          setMobileDrawerVisible(false);
        }
      }}
    />
  );

  const renderSidebarContent = () => {
    if (!user) return;

    return (
      <>
        {/* Logo/Brand */}
        <div className="p-6 text-center border-b border-gray-100">
          <CustomLogo hideDescription={true} />
        </div>

        {/* Navigation Menu */}
        <div className="p-0 flex flex-col h-full">
          <div className="flex-1">{renderMenu()}</div>

          {/* User Info & Logout */}
          <div className="border-t border-gray-100 mt-auto">
            {/* User Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4">
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 border-red-600 h-12 flex items-center justify-center gap-2"
                size="large"
              >
                {!sidebarCollapsed && "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderMobileDrawerContent = () => (
    <div className="h-full flex flex-col">
      {/* Mobile Drawer Header */}
      <div className="p-6 text-center border-b border-gray-100">
        <CustomLogo />
      </div>

      {/* Mobile Menu */}
      <div className="flex-1 p-0">
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          className="custom-sidebar-menu"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            margin: 0,
          }}
          onClick={() => setMobileDrawerVisible(false)}
        />
      </div>

      {/* Mobile User Info & Logout */}
      <div className="border-t border-gray-200 mt-auto">
        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">
                {user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              handleSignOut();
              setMobileDrawerVisible(false);
            }}
            className="w-full bg-red-600 hover:bg-red-700 border-red-600 h-12 flex items-center justify-center gap-2"
            size="large"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7c3aed",
          colorBgContainer: "#ffffff",
          colorText: "#1f2937",
          colorTextSecondary: "#6b7280",
          borderRadius: 8,
          fontFamily: "var(--font-geist-sans), sans-serif",
        },
        components: {
          Layout: {
            bodyBg: "#f8fafc",
            headerBg: "#ffffff",
            siderBg: "#ffffff",
          },
          Menu: {
            itemBg: "#ffffff",
            itemSelectedBg: "#f3f4f6",
            itemHoverBg: "#f9fafb",
            itemMarginBlock: 0,
            itemPaddingInline: 0,
            itemHeight: 48,
          },
          Drawer: {
            colorBgElevated: "#ffffff",
            padding: 0,
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        {isMobile && user && (
          <div className="lg:hidden fixed top-0 right-0 h-16 z-50 px-4 flex items-center justify-between w-full left-0 backdrop-blur-md border-b border-gray-300">
            <CustomLogo className="text-xl" />
            <Button
              type="text"
              icon={<MenuOutlined size={17} />}
              onClick={() => setMobileDrawerVisible(true)}
              className="text-black"
            />
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && user && (
          <Sider
            width={280}
            collapsible
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
            className="hidden lg:block fixed right-0 top-0 h-screen shadow-lg z-40"
            style={{
              background: "#ffffff",
              overflow: "auto",
            }}
          >
            {renderSidebarContent()}
          </Sider>
        )}

        {/* Mobile Drawer */}
        <Drawer
          placement="right"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          size={280}
          closeIcon={
            <CloseOutlined className="text-gray-600 absolute right-3 top-3" />
          }
          className="lg:hidden"
          styles={{
            body: {
              padding: 0,
              margin: 0,
            },
            header: {
              padding: 0,
              borderBottom: "none",
              margin: 0,
            },
          }}
        >
          {renderMobileDrawerContent()}
        </Drawer>

        {/* Main Content Area */}
        <Layout
          className={`transition-all duration-200 ${
            isMobile ? "ml-0 mt-16" : "ml-0"
          }`}
        >
          <Content className="min-h-screen p-4">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
