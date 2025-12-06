import { supabase } from "@/lib/supabase/client";
import { Order } from "@/components/orders/types";

export class OrderService {
  static async createOrder(
    orderData: Omit<Order, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOrder(orderId: string, orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from("orders")
      .update(orderData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteOrder(orderId: string) {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) throw error;
  }

  static async getOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return data;
  }
}
