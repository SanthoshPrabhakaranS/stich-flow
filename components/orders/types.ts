export type OrderStatus =
  | "new"
  | "cutting"
  | "stitching"
  | "finishing"
  | "ready"
  | "delivered";

export interface OrderStats {
  total: number;
  new: number;
  cutting: number;
  stitching: number;
  finishing: number;
  ready: number;
  delivered: number;
}

export interface Measurement {
  shoulder_width?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  arm_length?: number;
  sleeve_length?: number;
  armhole?: number;
  neck_front?: number;
  neck_back?: number;
  top_length?: number;
  blouse_length?: number;
  skirt_length?: number;
  [key: string]: number | undefined;
}

export interface Order {
  id: string;
  customer_id: string; // CUS_01, CUS_02, etc.
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  item_type: string;
  due_date: string;
  stitching_price: number;
  material_price: number;
  status: OrderStatus;
  measurements: Measurement;
  design_photos?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderFormValues {
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  item_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  due_date: any;
  stitching_price: number;
  material_price: number;
  status: OrderStatus;
  measurements: Measurement;
  notes?: string;
}
