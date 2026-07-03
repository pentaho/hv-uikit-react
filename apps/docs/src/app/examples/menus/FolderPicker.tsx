import { forwardRef, useState } from "react";
import {
  HvBaseDropdown,
  HvButton,
  HvIconContainer,
  HvLabel,
  HvPanel,
  HvTreeItem,
  HvTreeView,
  HvTypography,
  type HvTreeItemProps,
} from "@hitachivantara/uikit-react-core";

type FileNode = {
  id: string;
  label: string;
  path: string;
  type: "folder" | "file";
  children?: FileNode[];
};

const tree: FileNode = {
  id: "workspace",
  label: "workspace",
  path: "/workspace",
  type: "folder",
  children: [
    {
      id: "projects",
      label: "projects",
      path: "/workspace/projects",
      type: "folder",
      children: [
        {
          id: "alpha",
          label: "alpha",
          path: "/workspace/projects/alpha",
          type: "folder",
          children: [
            {
              id: "alpha-output",
              label: "output",
              path: "/workspace/projects/alpha/output",
              type: "folder",
            },
            {
              id: "alpha-input",
              label: "input",
              path: "/workspace/projects/alpha/input",
              type: "folder",
            },
            {
              id: "alpha-config",
              label: "config.json",
              path: "/workspace/projects/alpha/config.json",
              type: "file",
            },
          ],
        },
        {
          id: "beta",
          label: "beta",
          path: "/workspace/projects/beta",
          type: "folder",
          children: [
            {
              id: "beta-results",
              label: "results",
              path: "/workspace/projects/beta/results",
              type: "folder",
            },
            {
              id: "beta-log",
              label: "run.log",
              path: "/workspace/projects/beta/run.log",
              type: "file",
            },
          ],
        },
      ],
    },
    {
      id: "shared",
      label: "shared",
      path: "/workspace/shared",
      type: "folder",
      children: [
        {
          id: "shared-exports",
          label: "exports",
          path: "/workspace/shared/exports",
          type: "folder",
        },
        {
          id: "shared-reports",
          label: "reports",
          path: "/workspace/shared/reports",
          type: "folder",
        },
      ],
    },
    {
      id: "temp",
      label: "temp",
      path: "/workspace/temp",
      type: "folder",
    },
  ],
};

// Build a flat lookup: nodeId → FileNode
const buildIndex = (node: FileNode, acc: Map<string, FileNode> = new Map()) => {
  acc.set(node.id, node);
  node.children?.forEach((child) => buildIndex(child, acc));
  return acc;
};
const nodeIndex = buildIndex(tree);

const FolderIcon = () => (
  <HvIconContainer>
    <div className="i-ph-folder-notch-fill color-info" />
  </HvIconContainer>
);
const FolderOpenIcon = () => (
  <HvIconContainer>
    <div className="i-ph-folder-notch-open-fill color-info" />
  </HvIconContainer>
);
const FileIcon = () => (
  <HvIconContainer>
    <div className="i-ph-file color-textSubtle" />
  </HvIconContainer>
);

const FolderTreeItem = forwardRef<HTMLLIElement, HvTreeItemProps>(
  function FolderTreeItem({ nodeId, label, children, disabled, ...rest }, ref) {
    const isFile = nodeIndex.get(nodeId)?.type === "file";
    return (
      <HvTreeItem
        ref={ref}
        nodeId={nodeId}
        disabled={disabled || isFile}
        icon={isFile ? <FileIcon /> : !children ? <FolderIcon /> : undefined}
        expandIcon={<FolderIcon />}
        collapseIcon={<FolderOpenIcon />}
        label={
          <HvTypography
            variant="body"
            className={isFile ? "color-textDisabled" : undefined}
          >
            {label}
          </HvTypography>
        }
        {...rest}
      >
        {children}
      </HvTreeItem>
    );
  },
);

const renderNode = (node: FileNode): React.ReactNode => (
  <FolderTreeItem key={node.id} nodeId={node.id} label={node.label}>
    {node.children?.map(renderNode)}
  </FolderTreeItem>
);

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const pendingNode = pendingId ? nodeIndex.get(pendingId) : null;

  const handleConfirm = () => {
    if (pendingNode) {
      setSelectedPath(pendingNode.path);
      setOpen(false);
      setPendingId(null);
    }
  };

  return (
    <div className="w-340px">
      <HvLabel label="Output folder" showGutter />
      <HvBaseDropdown
        expanded={open}
        onToggle={(_, isOpen) => {
          setOpen(isOpen);
          if (isOpen) setPendingId(null);
        }}
        placeholder={
          <div className="flex items-center gap-xs overflow-hidden">
            <HvIconContainer className="shrink-0">
              <div
                className={`i-ph-folder-notch-fill ${selectedPath ? "color-info" : "color-textSubtle"}`}
              />
            </HvIconContainer>
            <HvTypography noWrap className="flex-1 text-left">
              {selectedPath ?? "Select output folder..."}
            </HvTypography>
          </div>
        }
      >
        <HvPanel className="w-340px flex flex-col">
          <div className="px-xs pt-xs pb-xxs border-b-1 border-borderSubtle">
            <HvTypography variant="label" className="color-textSubtle">
              Select a folder
            </HvTypography>
          </div>

          <div className="overflow-auto max-h-260px py-xs">
            <HvTreeView
              multiSelect={false}
              defaultExpanded={["workspace", "projects"]}
              aria-label="Output folder selector"
              onNodeSelect={(_, nodeId) => {
                const node = nodeIndex.get(nodeId as string);
                if (node?.type === "folder") setPendingId(nodeId as string);
              }}
            >
              {renderNode(tree)}
            </HvTreeView>
          </div>

          <div className="flex items-center justify-between gap-xs px-xs py-xs border-t-1 border-borderSubtle">
            <HvTypography
              variant="caption1"
              className="color-textSubtle truncate flex-1"
            >
              {pendingNode ? pendingNode.path : "No folder selected"}
            </HvTypography>
            <HvButton size="xs" disabled={!pendingId} onClick={handleConfirm}>
              Select
            </HvButton>
          </div>
        </HvPanel>
      </HvBaseDropdown>
    </div>
  );
}
