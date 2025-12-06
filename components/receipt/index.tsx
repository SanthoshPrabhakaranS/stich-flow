import { Order } from "../orders/types";

interface ReceiptProps {
  order: Order;
  className?: string;
}

export default function Receipt({ order, className = "" }: ReceiptProps) {
  const totalAmount = order.stitching_price + order.material_price;
  const currentDate = new Date().toLocaleDateString();

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto ${className}`}
      id="receipt"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#000000",
      }}
    >
      {/* Header */}
      <div
        className="text-center border-b-2 pb-4 mb-4"
        style={{ borderBottom: "2px solid #7c3aed" }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            color: "#7c3aed",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          STICHFLOW
        </h1>
        <p
          className="text-sm mb-1"
          style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}
        >
          Boutique & Tailoring
        </p>
        <p className="text-xs" style={{ color: "#9ca3af", fontSize: "12px" }}>
          📞 +91 9876543210 | 📍 Your Address
        </p>
      </div>

      {/* Order Info */}
      <div className="space-y-3 mb-4" style={{ marginBottom: "16px" }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#6b7280", fontSize: "14px" }}>Order ID:</span>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            {order.id}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            Customer ID:
          </span>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            {order.customer_id}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "#6b7280", fontSize: "14px" }}>Date:</span>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            {currentDate}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div
        className="border-t pt-3 mb-4"
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "12px",
          marginBottom: "16px",
        }}
      >
        <h3
          className="font-semibold mb-2"
          style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}
        >
          CUSTOMER DETAILS
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>Name:</span>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>
              {order.customer_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>Phone:</span>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>
              {order.customer_phone}
            </span>
          </div>
          {order.customer_address && (
            <div className="flex justify-between">
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                Address:
              </span>
              <span
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  textAlign: "right",
                  maxWidth: "192px",
                }}
              >
                {order.customer_address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div
        className="border-t pt-3 mb-4"
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "12px",
          marginBottom: "16px",
        }}
      >
        <h3
          className="font-semibold mb-2"
          style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}
        >
          ORDER DETAILS
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Item Type:
            </span>
            <span
              style={{
                fontWeight: "500",
                backgroundColor: "#f3f4f6",
                color: "#7c3aed",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {order.item_type}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Due Date:
            </span>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>
              {new Date(order.due_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>Status:</span>
            <span
              style={{
                fontWeight: "500",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                backgroundColor:
                  order.status === "ready"
                    ? "#dcfce7"
                    : order.status === "delivered"
                    ? "#dbeafe"
                    : "#fed7aa",
                color:
                  order.status === "ready"
                    ? "#166534"
                    : order.status === "delivered"
                    ? "#1e40af"
                    : "#9a3412",
              }}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div
        className="border-t pt-3 mb-4"
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "12px",
          marginBottom: "16px",
        }}
      >
        <h3
          className="font-semibold mb-2"
          style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}
        >
          PRICE BREAKDOWN
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Stitching Price:
            </span>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>
              ₹{order.stitching_price}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Material Price:
            </span>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>
              ₹{order.material_price}
            </span>
          </div>
          <div
            className="border-t pt-2 mt-2"
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "8px",
              marginTop: "8px",
            }}
          >
            <div className="flex justify-between font-bold">
              <span
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  fontSize: "16px",
                }}
              >
                TOTAL AMOUNT:
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#059669",
                  fontSize: "16px",
                }}
              >
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Measurements */}
      {order.measurements && Object.keys(order.measurements).length > 0 && (
        <div
          className="border-t pt-3 mb-4"
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "12px",
            marginBottom: "16px",
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}
          >
            MEASUREMENTS
          </h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(
              order.measurements as Record<
                string,
                string | number | null | undefined
              >
            ).map(
              ([key, value]) =>
                value != null && (
                  <div key={key} className="flex justify-between">
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span style={{ fontWeight: "500", fontSize: "12px" }}>
                      {String(value)}&apos;
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div
          className="border-t pt-3 mb-4"
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "12px",
            marginBottom: "16px",
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}
          >
            NOTES
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            {order.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        className="border-t-2 pt-4 text-center"
        style={{ borderTop: "2px solid #7c3aed", paddingTop: "16px" }}
      >
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
          Thank you for your business!
        </p>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          <p>📍 Visit us for your next order</p>
          <p>⭐ Quality guaranteed</p>
        </div>
      </div>
    </div>
  );
}
