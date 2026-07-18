/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { forwardRef, useMemo, useRef, useState } from "react";
import {
  HvBadge,
  HvBaseDropdown,
  HvCheckBox,
  HvIconButton,
  HvIconContainer,
  HvPanel,
  HvTreeItem,
  HvTreeView,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

type NodeType = "server" | "schema" | "table" | "column" | "folder" | "cloud";

interface DbNode {
  id: string;
  label: string;
  type: NodeType;
  children?: DbNode[];
}

const dbTree: DbNode[] = [
  {
    id: "oracle-berlin",
    label: "Oracle Berlin",
    type: "server",
    children: [
      {
        id: "ob-prod",
        label: "OB_PROD",
        type: "schema",
        children: [
          {
            id: "ob-customers",
            label: "customers",
            type: "table",
            children: [
              { id: "ob-cust-id", label: "customer_id", type: "column" },
              { id: "ob-cust-name", label: "full_name", type: "column" },
              { id: "ob-cust-email", label: "email", type: "column" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "postgres-eu",
    label: "Postgres EU",
    type: "server",
    children: [
      {
        id: "cust-data",
        label: "CUST_DATA",
        type: "schema",
        children: [
          {
            id: "contacts",
            label: "contacts",
            type: "table",
            children: [
              { id: "contact-name", label: "name", type: "column" },
              { id: "contact-email", label: "email", type: "column" },
              { id: "contact-phone", label: "phone", type: "column" },
              { id: "contact-city", label: "city", type: "column" },
            ],
          },
          {
            id: "transactions",
            label: "transactions",
            type: "table",
            children: [
              { id: "tx-id", label: "tx_id", type: "column" },
              { id: "tx-amount", label: "amount", type: "column" },
              { id: "tx-date", label: "date", type: "column" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "postgres-us",
    label: "Postgres US",
    type: "server",
    children: [
      {
        id: "us-data",
        label: "US_DATA",
        type: "schema",
        children: [
          {
            id: "us-orders",
            label: "orders",
            type: "table",
            children: [
              { id: "us-order-id", label: "order_id", type: "column" },
              { id: "us-status", label: "status", type: "column" },
              { id: "us-total", label: "total", type: "column" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    type: "cloud",
    children: [
      {
        id: "mtg-q4",
        label: "MTG_Q4_2024",
        type: "folder",
        children: [
          {
            id: "mtg-campaigns",
            label: "campaigns",
            type: "table",
            children: [
              { id: "mtg-id", label: "campaign_id", type: "column" },
              { id: "mtg-budget", label: "budget", type: "column" },
              { id: "mtg-region", label: "region", type: "column" },
            ],
          },
        ],
      },
    ],
  },
];

/** Returns all IDs in a subtree (node + all descendants) */
const getAllIds = (node: DbNode): string[] => [
  node.id,
  ...(node.children?.flatMap(getAllIds) ?? []),
];

/** Returns only the leaf IDs (nodes without children) in a subtree */
const getLeafIds = (node: DbNode): string[] =>
  node.children?.length ? node.children.flatMap(getLeafIds) : [node.id];

/**
 * Returns the "topmost" selected nodes — the minimal set that represents
 * the selection. Fully-checked parents collapse their children into one entry.
 */
const getTopSelected = (nodes: DbNode[], checked: Set<string>): DbNode[] =>
  nodes.flatMap((node) => {
    const leafIds = getLeafIds(node);
    const n = leafIds.filter((id) => checked.has(id)).length;
    if (n === 0) return [];
    if (n === leafIds.length) return [node];
    return getTopSelected(node.children ?? [], checked);
  });

// Flat node index for O(1) lookups
const buildIndex = (
  nodes: DbNode[],
  acc = new Map<string, DbNode>(),
): Map<string, DbNode> => {
  nodes.forEach((n) => {
    acc.set(n.id, n);
    buildIndex(n.children ?? [], acc);
  });
  return acc;
};
const nodeIndex = buildIndex(dbTree);

const typeIcon: Record<NodeType, string> = {
  server: "i-ph-database",
  schema: "i-ph-circles-three-plus",
  table: "i-ph-table",
  column: "i-ph-columns",
  folder: "i-ph-folder",
  cloud: "i-ph-cloud",
};

// --- Header component ---
// Must be a stable forwardRef component defined outside the main component
// so HvBaseDropdown can forward the popper anchor ref to the DOM button.
const HeaderComponent = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
>(function HeaderComponent(props, ref) {
  return (
    <HvIconButton ref={ref} title="Toggle database picker" {...props}>
      <div className="i-ph-dots-three-vertical" />
    </HvIconButton>
  );
});

// --- Tree item ---
interface DbTreeItemProps {
  node: DbNode;
  checked: Set<string>;
  onToggle: (id: string) => void;
}

function DbTreeItem({ node, checked, onToggle }: DbTreeItemProps) {
  const leafIds = useMemo(() => getLeafIds(node), [node]);
  const checkedCount = leafIds.filter((id) => checked.has(id)).length;
  const isFullyChecked = checkedCount === leafIds.length;
  const isIndeterminate = !isFullyChecked && checkedCount > 0;

  return (
    <HvTreeItem
      style={{ zIndex: 0 }}
      nodeId={node.id}
      label={
        // stopPropagation prevents:
        //   1. bubbling to DefaultContent's wrapper → no expand/collapse on label click
        //   2. bubbling to ancestor <li> elements → no parent toggle triggered
        <div
          className="flex items-center gap-xs flex-1"
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(node.id);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.stopPropagation();
              onToggle(node.id);
            }
          }}
        >
          <HvCheckBox
            style={{ zIndex: -1 }}
            checked={isFullyChecked}
            indeterminate={isIndeterminate}
            onChange={() => {}}
            className="pointer-events-none"
          />
          <HvIconContainer>
            <div className={typeIcon[node.type]} />
          </HvIconContainer>
          <HvTypography variant="body">{node.label}</HvTypography>
        </div>
      }
    >
      {node.children?.map((child) => (
        <DbTreeItem
          key={child.id}
          node={child}
          checked={checked}
          onToggle={onToggle}
        />
      ))}
    </HvTreeItem>
  );
}

export default function DatabasePicker() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const node = nodeIndex.get(nodeId);
    if (!node) return;
    const allIds = getAllIds(node);
    const leafIds = getLeafIds(node);
    setChecked((prev) => {
      const next = new Set(prev);
      const allLeafsChecked = leafIds.every((id) => prev.has(id));
      if (allLeafsChecked) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const selectedItems = useMemo(
    () => getTopSelected(dbTree, checked),
    [checked],
  );

  const selectedLeafCount = useMemo(
    () => selectedItems.reduce((acc, node) => acc + getLeafIds(node).length, 0),
    [selectedItems],
  );

  // Track focused node via ref (no re-render needed) for keyboard selection
  const focusedNodeRef = useRef<string | null>(null);

  return (
    <div className="relative inline-flex">
      <HvBaseDropdown
        headerComponent={HeaderComponent}
        expanded={open}
        onToggle={(_, isOpen) => setOpen(isOpen)}
        variableWidth
        onContainerCreation={(containerEl) => {
          containerEl?.querySelector<HTMLElement>('[role="tree"]')?.focus();
        }}
      >
        <HvPanel className="w-[420px] max-h-[400px] overflow-y-auto">
          <HvTreeView
            disableSelection
            onNodeFocus={(_, nodeId) => {
              focusedNodeRef.current = nodeId;
            }}
            onKeyDown={(e) => {
              if (
                (e.key === " " || e.key === "Enter") &&
                focusedNodeRef.current
              ) {
                toggleNode(focusedNodeRef.current);
              }
            }}
            defaultExpanded={[
              "postgres-eu",
              "cust-data",
              "contacts",
              "marketing",
            ]}
            aria-label="Database structure"
          >
            {dbTree.map((node) => (
              <DbTreeItem
                key={node.id}
                node={node}
                checked={checked}
                onToggle={toggleNode}
              />
            ))}
          </HvTreeView>
        </HvPanel>
      </HvBaseDropdown>
      {selectedLeafCount > 0 && (
        <HvBadge
          label={selectedLeafCount}
          showCount
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-none"
        />
      )}
    </div>
  );
}
