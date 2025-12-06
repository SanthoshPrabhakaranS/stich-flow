import { Order } from "../types";

// Generate sequential customer ID
export function generateCustomerId(existingOrders: Order[]): string {
  // Extract all existing customer IDs
  const existingCustomerIds = existingOrders
    .map((order) => order.customer_id)
    .filter((id) => id.startsWith("CUS_"));

  if (existingCustomerIds.length === 0) {
    return "CUS_01";
  }

  // Extract numbers and find the maximum
  const customerNumbers = existingCustomerIds.map((id) => {
    const match = id.match(/CUS_(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });

  const maxNumber = Math.max(...customerNumbers);
  const nextNumber = maxNumber + 1;

  // Format as CUS_01, CUS_02, etc.
  return `CUS_${nextNumber.toString().padStart(2, "0")}`;
}

// Find existing customer by phone number
export function findCustomerByPhone(
  orders: Order[],
  phone: string
): Order | undefined {
  const cleanPhone = phone.replace(/\D/g, "");
  return orders.find(
    (order) => order.customer_phone.replace(/\D/g, "") === cleanPhone
  );
}

// Get all unique customers from orders
export function getAllCustomers(orders: Order[]): Array<{
  id: string;
  name: string;
  phone: string;
  address?: string;
  total_orders: number;
  total_spending: number;
  first_order_date: string;
  last_order_date: string;
}> {
  const customersMap = new Map();

  orders.forEach((order) => {
    if (!customersMap.has(order.customer_id)) {
      customersMap.set(order.customer_id, {
        id: order.customer_id,
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        total_orders: 1,
        total_spending: order.stitching_price + order.material_price,
        first_order_date: order.created_at,
        last_order_date: order.created_at,
      });
    } else {
      const customer = customersMap.get(order.customer_id);
      customer.total_orders += 1;
      customer.total_spending += order.stitching_price + order.material_price;
      if (new Date(order.created_at) > new Date(customer.last_order_date)) {
        customer.last_order_date = order.created_at;
      }
    }
  });

  return Array.from(customersMap.values());
}
