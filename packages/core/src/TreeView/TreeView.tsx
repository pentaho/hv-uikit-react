import { useSlotProps } from "@mui/base";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../icons";
import { fixedForwardRef, HvBaseProps } from "../types/generic";
import {
  DEFAULT_TREE_VIEW_PLUGINS,
  DefaultTreeViewPluginParameters,
} from "./internals/hooks/plugins";
import { useTreeView } from "./internals/hooks/useTreeView";
import { TreeViewProvider } from "./internals/TreeViewProvider";
import { staticClasses, useClasses } from "./TreeView.styles";

export { staticClasses as treeView2Classes }; // TODO: remove old `treeViewClasses`

export type HvTreeViewClasses = ExtractNames<typeof useClasses>;

export interface HvTreeViewProps<Multiple extends boolean | undefined>
  extends HvBaseProps<HTMLUListElement>,
    DefaultTreeViewPluginParameters<Multiple> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvTreeViewClasses;
  /** Tree View children. Usually a `HvTreeItem` instance, or a custom variation of it */
  children?: React.ReactNode;
}

/**
 * A Tree View displays hierarchical data and helps users explore nested categories.
 * Tree structures are built using `HvTreeItem` or a custom variation of it.
 *
 * @example
 * ```tsx
 * <HvTreeView>
 *   <HvTreeItem nodeId="1" label="File1" />
 * </HvTreeView>
 * ```
 */
export const HvTreeView = fixedForwardRef(function HvTreeView<
  Multiple extends boolean | undefined,
>(props: HvTreeViewProps<Multiple>, ref: React.Ref<HTMLUListElement>) {
  const {
    id,
    children,
    classes: classesProp,
    className,

    disabledItemsFocusable,
    multiSelect,
    expanded,
    defaultExpanded,
    selected,
    defaultSelected,
    disableSelection,
    defaultCollapseIcon = <HvIcon name="CaretDown" size="xs" />,
    defaultExpandIcon = <HvIcon name="CaretRight" size="xs" />,
    defaultEndIcon,
    defaultParentIcon,
    onNodeSelect,
    onNodeToggle,
    onNodeFocus,
    ...others
  } = useDefaultProps("HvTreeView", props);
  const { classes, cx } = useClasses(classesProp);

  const { getRootProps, contextValue } = useTreeView({
    disabledItemsFocusable,
    expanded,
    defaultExpanded,
    onNodeToggle,
    onNodeFocus,
    disableSelection,
    defaultSelected,
    selected,
    multiSelect,
    onNodeSelect: onNodeSelect as HvTreeViewProps<any>["onNodeSelect"],
    id,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpandIcon,
    defaultParentIcon,
    plugins: DEFAULT_TREE_VIEW_PLUGINS,
    rootRef: ref,
  });

  const rootProps = useSlotProps({
    elementType: "ul",
    externalSlotProps: {},
    externalForwardedProps: others,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props,
  });

  return (
    <TreeViewProvider value={contextValue}>
      <ul className={cx(classes.root, className)} {...rootProps} {...others}>
        {children}
      </ul>
    </TreeViewProvider>
  );
});
