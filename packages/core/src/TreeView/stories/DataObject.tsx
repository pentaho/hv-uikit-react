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
import { forwardRef } from "react";
import { css } from "@emotion/css";
import {
  HvPanel,
  HvTreeItem,
  HvTreeView,
  type HvTreeItemProps,
} from "@hitachivantara/uikit-react-core";
import { Doc, Folders } from "@hitachivantara/uikit-react-icons";

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
    const Icon = children ? Folders : Doc;

    return (
      <HvTreeItem
        ref={ref}
        nodeId={nodeId}
        label={
          <div className={css({ display: "flex", alignItems: "center" })}>
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

export const DataObject = () => {
  return (
    <HvPanel style={{ width: 400 }}>
      <HvTreeView aria-label="file system navigator">
        {renderItem(treeDataObject)}
      </HvTreeView>
    </HvPanel>
  );
};
