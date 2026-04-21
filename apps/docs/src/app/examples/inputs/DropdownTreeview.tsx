import { forwardRef, useState } from "react";
import {
  HvBaseDropdown,
  HvIconContainer,
  HvLabel,
  HvPanel,
  HvTreeItem,
  HvTreeView,
  type HvTreeItemProps,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <>
      <HvLabel>Dropdown with treeview</HvLabel>
      <HvBaseDropdown
        expanded={open}
        className="w-300px"
        placeholder={file || "Select a file or folder..."}
        adornment={
          <HvIconContainer>
            <div className="i-ph-list-bullets" />
          </HvIconContainer>
        }
        classes={{
          arrowContainer: "flex w-32px h-full items-center justify-center",
        }}
        onToggle={(_evt, s) => setOpen(s)}
      >
        <HvPanel>
          <HvTreeView
            multiSelect={false}
            aria-label="file system navigator"
            onNodeSelect={(_, val) => {
              console.log(val);
              setFile(val);
            }}
          >
            {renderItem(treeDataObject)}
          </HvTreeView>
        </HvPanel>
      </HvBaseDropdown>
    </>
  );
}
type TreeData = { id: string; label: string; children?: TreeData[] };

const treeDataObject = {
  id: "user",
  label: "User",
  children: [
    {
      id: "Applications",
      label: "Applications",
      children: [
        { id: "Code", label: "Code.app" },
        { id: "Chrome", label: "Chrome.app" },
        { id: "Firefox", label: "Firefox.app" },
      ],
    },
    {
      id: "Documents",
      label: "Documents",
      children: [{ id: "secret", label: "secret.txt" }],
    },
    {
      id: "git",
      label: "git",
      children: [
        {
          id: "uikit-react",
          label: "uikit-react",
          children: [{ id: "uikit-pkg", label: "package.json" }],
        },
        {
          id: "app-shell",
          label: "app-shell",
          children: [{ id: "as-pkg", label: "package.json" }],
        },
      ],
    },
  ],
} satisfies TreeData;

const SimpleTreeItem = forwardRef<HTMLLIElement, HvTreeItemProps>(
  function SimpleTreeItem(props, ref) {
    const { children, nodeId, label, ...others } = props;
    const Icon = children
      ? () => (
          <HvIconContainer>
            <div className="i-ph-folder" />
          </HvIconContainer>
        )
      : () => (
          <HvIconContainer>
            <div className="i-ph-file" />
          </HvIconContainer>
        );

    return (
      <HvTreeItem
        ref={ref}
        nodeId={nodeId}
        label={
          <div className="flex items-center">
            <Icon />
            <span style={{ flex: 1 }}>{label}</span>
          </div>
        }
        {...others}
      >
        {children}
      </HvTreeItem>
    );
  },
);

/** Render tree view items */
const renderItem = ({ id, label, children }: TreeData) => (
  <SimpleTreeItem key={id} nodeId={id} label={label}>
    {children?.map(renderItem)}
  </SimpleTreeItem>
);
