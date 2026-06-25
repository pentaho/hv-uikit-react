import { useState } from "react";
import {
  HvBaseDropdown,
  HvPanel,
  HvStatusIcon,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTypography,
  type HvStatusIconVariant,
} from "@hitachivantara/uikit-react-core";

type AlertStatus = "Active" | "Acknowledged" | "Resolved" | "Suppressed";

const statusConfig: Record<
  AlertStatus,
  { variant: HvStatusIconVariant; next: AlertStatus[] }
> = {
  Active: {
    variant: "error",
    next: ["Acknowledged", "Suppressed"],
  },
  Acknowledged: {
    variant: "warning",
    next: ["Resolved", "Active"],
  },
  Resolved: {
    variant: "success",
    next: ["Active"],
  },
  Suppressed: {
    variant: "info",
    next: ["Active"],
  },
};

const initialAlerts = [
  { id: "1", name: "High CPU usage", asset: "Server-01", status: "Active" },
  {
    id: "2",
    name: "Disk space low",
    asset: "Storage-A",
    status: "Acknowledged",
  },
  { id: "3", name: "Network timeout", asset: "Router-02", status: "Active" },
  { id: "4", name: "Temp threshold", asset: "Sensor-07", status: "Suppressed" },
  { id: "5", name: "Memory leak", asset: "App-Server", status: "Resolved" },
] as { id: string; name: string; asset: string; status: AlertStatus }[];

function StatusDropdown({
  status,
  onChange,
}: {
  status: AlertStatus;
  onChange: (next: AlertStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const config = statusConfig[status];

  return (
    <HvBaseDropdown
      expanded={open}
      onToggle={(_, isOpen) => setOpen(isOpen)}
      placement="right"
      variableWidth
      classes={{
        root: "inline-flex! w-auto!",
        header:
          "border-transparent! bg-transparent! min-h-0! p-2px! rounded! hover:bg-bgHover! shadow-none!",
        arrowContainer: "hidden!",
        selection: "flex items-center",
      }}
      placeholder={
        <div className="flex items-center gap-xs cursor-pointer">
          <HvStatusIcon variant={config.variant} type="simple" />
          <HvTypography variant="label">{status}</HvTypography>
          <div className="i-ph-caret-down text-12px color-textSubtle" />
        </div>
      }
    >
      <HvPanel className="min-w-160px p-xxs flex flex-col">
        <HvTypography
          variant="caption2"
          className="color-textSubtle px-xs pt-xs pb-xxs"
        >
          Change status to
        </HvTypography>
        {config.next.map((next) => (
          <button
            type="button"
            key={next}
            className="flex items-center gap-xs px-xs py-xs rounded hover:bg-bgHover w-full text-left"
            onClick={() => {
              onChange(next);
              setOpen(false);
            }}
          >
            <HvStatusIcon variant={statusConfig[next].variant} type="simple" />
            <HvTypography variant="label">{next}</HvTypography>
          </button>
        ))}
      </HvPanel>
    </HvBaseDropdown>
  );
}

export default function Demo() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const updateStatus = (id: string, next: AlertStatus) =>
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: next } : a)),
    );

  return (
    <HvTableSection>
      <HvTableContainer>
        <HvTable>
          <HvTableHead>
            <HvTableRow>
              <HvTableHeader>Alert</HvTableHeader>
              <HvTableHeader>Asset</HvTableHeader>
              <HvTableHeader>Status</HvTableHeader>
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>
            {alerts.map((alert) => (
              <HvTableRow key={alert.id}>
                <HvTableCell>{alert.name}</HvTableCell>
                <HvTableCell>{alert.asset}</HvTableCell>
                <HvTableCell>
                  <StatusDropdown
                    status={alert.status}
                    onChange={(next) => updateStatus(alert.id, next)}
                  />
                </HvTableCell>
              </HvTableRow>
            ))}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
    </HvTableSection>
  );
}
