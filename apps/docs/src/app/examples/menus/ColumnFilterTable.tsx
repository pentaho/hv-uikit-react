import { useMemo, useState } from "react";
import {
  HvBaseDropdown,
  HvButton,
  HvCheckBox,
  HvEmptyState,
  HvIconButton,
  HvIconContainer,
  HvPanel,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

const rows = [...Array(12).keys()].map((i) => ({
  id: `${i + 1}`,
  name: `Event ${i + 1}`,
  status: (["Open", "Closed"] as const)[i % 2],
  severity: (["Critical", "Major", "Average", "Minor"] as const)[i % 4],
  priority: (["High", "Medium", "Low"] as const)[i % 3],
}));

type FilterKey = "status" | "severity" | "priority";

const uniqueValues = (key: FilterKey) =>
  [...new Set(rows.map((r) => r[key]))] as string[];

interface ColumnFilterProps {
  options: string[];
  activeFilters: string[];
  onApply: (values: string[]) => void;
}

function ColumnFilter({ options, activeFilters, onApply }: ColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const isActive = activeFilters.length > 0;

  const handleToggle = (_: unknown, isOpen: boolean) => {
    if (isOpen) setPending(activeFilters);
    setOpen(isOpen);
  };

  const toggle = (val: string) =>
    setPending((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );

  return (
    <HvBaseDropdown
      expanded={open}
      onToggle={handleToggle}
      placement="right"
      variableWidth
      classes={{
        root: "inline-flex! w-auto!",
        header: "border-transparent! bg-transparent!",
        arrowContainer: "hidden!",
        selection: "flex items-center pr-xs",
      }}
      placeholder={
        <HvIconContainer>
          <HvIconButton title="Filter">
            <div
              className={`i-ph-funnel ${isActive ? "color-primary" : "color-textSubtle"}`}
            />
          </HvIconButton>
        </HvIconContainer>
      }
    >
      <HvPanel className="min-w-160px p-xs flex flex-col gap-xs">
        {options.map((opt) => (
          <HvCheckBox
            key={opt}
            label={opt}
            checked={pending.includes(opt)}
            onChange={() => toggle(opt)}
          />
        ))}
        <div className="flex gap-xs mt-xs pt-xs border-t-1 border-borderSubtle">
          <HvButton
            size="xs"
            onClick={() => {
              onApply(pending);
              setOpen(false);
            }}
          >
            Apply
          </HvButton>
          <HvButton
            size="xs"
            variant="secondaryGhost"
            onClick={() => {
              setPending([]);
              onApply([]);
              setOpen(false);
            }}
          >
            Clear
          </HvButton>
        </div>
      </HvPanel>
    </HvBaseDropdown>
  );
}

const filterKeys: FilterKey[] = ["status", "severity", "priority"];

export default function Demo() {
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>({
    status: [],
    severity: [],
    priority: [],
  });

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!filters.status.length || filters.status.includes(r.status)) &&
          (!filters.severity.length || filters.severity.includes(r.severity)) &&
          (!filters.priority.length || filters.priority.includes(r.priority)),
      ),
    [filters],
  );

  const setFilter = (key: FilterKey) => (values: string[]) =>
    setFilters((prev) => ({ ...prev, [key]: values }));

  return (
    <HvTableSection>
      <HvTableContainer>
        <HvTable>
          <HvTableHead>
            <HvTableRow>
              <HvTableHeader>Name</HvTableHeader>
              {filterKeys.map((key) => (
                <HvTableHeader key={key}>
                  <div className="flex items-center gap-xxs capitalize">
                    {key}
                    <ColumnFilter
                      options={uniqueValues(key)}
                      activeFilters={filters[key]}
                      onApply={setFilter(key)}
                    />
                  </div>
                </HvTableHeader>
              ))}
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>
            {filtered.map((row) => (
              <HvTableRow key={row.id}>
                <HvTableCell>{row.name}</HvTableCell>
                <HvTableCell>{row.status}</HvTableCell>
                <HvTableCell>{row.severity}</HvTableCell>
                <HvTableCell>{row.priority}</HvTableCell>
              </HvTableRow>
            ))}
            {filtered.length === 0 && (
              <HvTableRow>
                <HvTableCell colSpan={4}>
                  <HvEmptyState
                    message="No results match the current filters."
                    icon={<Ban />}
                  />
                </HvTableCell>
              </HvTableRow>
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
    </HvTableSection>
  );
}
