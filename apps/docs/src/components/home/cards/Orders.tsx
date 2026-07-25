import {
  HvButton,
  HvColorAny,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { Card } from "./Card";

const orders = [
  { label: "John Doe", status: "Delivered" },
  { label: "Jane Smith", status: "Shipped" },
  { label: "Alice Johnson", status: "Pending" },
  { label: "Bob Brown", status: "Cancelled" },
  { label: "Charlie Davis", status: "Waiting Feedback" },
];

const statusMap: Record<string, HvColorAny> = {
  Delivered: "positive",
  Pending: "warning",
  Shipped: "info",
  Cancelled: "negative",
  "Waiting Feedback": "accent",
};

export const Orders = () => {
  return (
    <Card
      title={
        <div className="flex items-center gap-[var(--uikit-space-xs)]">
          <div className="i-ph-receipt" />
          <HvTypography variant="title4">Orders</HvTypography>
        </div>
      }
    >
      <div className="grid gap-[var(--uikit-space-xxs)]">
        {orders.map((order) => (
          <div
            key={order.status}
            className="flex items-center justify-between p-[var(--uikit-space-xs)] border-b border-border"
          >
            <HvTypography>{order.label}</HvTypography>
            <HvButton
              className="p-x-xs"
              color={statusMap[order.status]}
              variant="primary"
              size="sm"
            >
              {order.status}
            </HvButton>
          </div>
        ))}
      </div>
    </Card>
  );
};
