"use client";

import { useState, useEffect } from "react";
import OrdersHeader from "../../components/orders/orders-header";
import OrdersTable from "../../components/orders/orders-table";
import OrderModal from "../../components/orders/order-modal";
import { Order, OrderStatus } from "../../components/orders/types";
import { OrderService } from "@/services/order-services";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders from Supabase
      const ordersData = await OrderService.getOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally show error message to user
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterOrders(value, statusFilter);
  };

  const handleStatusFilter = (status: OrderStatus | "all") => {
    setStatusFilter(status);
    filterOrders(searchText, status);
  };

  const filterOrders = (search: string, status: OrderStatus | "all") => {
    let filtered = orders;

    if (search.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
          order.item_type.toLowerCase().includes(search.toLowerCase()) ||
          order.customer_phone.includes(search) ||
          order.customer_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    setFilteredOrders(filtered);
  };

  const handleCreateOrder = async (newOrder: Order) => {
    try {
      // The order is already created in the modal via OrderService
      // Just refresh the list to show the new order
      await fetchOrders();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error handling created order:", error);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      // The order is already updated in the modal via OrderService
      // Just refresh the list to show updated order
      await fetchOrders();
      setIsModalVisible(false);
      setEditingOrder(null);
    } catch (error) {
      console.error("Error handling updated order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await OrderService.deleteOrder(orderId);
      // Remove from local state
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setFilteredOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      // Optionally show error message to user
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await OrderService.updateOrder(orderId, { status: newStatus });

      // Update local state for immediate UI feedback
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updated_at: new Date().toISOString(),
            }
          : order
      );

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally show error message to user
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <OrdersHeader
        onAddOrder={() => setIsModalVisible(true)}
        searchText={searchText}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
        orders={orders}
      />

      {/* Orders List */}
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Create/Edit Modal */}
      <OrderModal
        visible={isModalVisible}
        editingOrder={editingOrder}
        existingOrders={orders}
        onCancel={handleModalCancel}
        onCreate={handleCreateOrder}
        onUpdate={handleUpdateOrder}
      />
    </div>
  );
}
