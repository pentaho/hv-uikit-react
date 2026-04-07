import {
  Panel,
  useStore,
  useStoreApi,
  type ControlProps,
  type PanelPosition,
  type ReactFlowState,
} from "reactflow";
import { shallow } from "zustand/shallow";
import {
  HvButton,
  HvMultiButton,
  useLabels,
} from "@hitachivantara/uikit-react-core";
import {
  Focus,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
} from "@hitachivantara/uikit-react-icons";

import { useFlowInstance } from "../hooks";

export type HvFlowControlsPosition = PanelPosition;

export interface HvFlowControlsProps
  extends Omit<
    ControlProps,
    "position" | "showFitView" | "showInteractive" | "showZoom"
  > {
  /** Controls position. Defaults to `bottom-center`. */
  position?: HvFlowControlsPosition;
  /** Controls orientation. Defaults to `horizontal`. */
  orientation?: "vertical" | "horizontal";
  /** Labels used on the controls buttons. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** Whether to hide the zoom controls. */
  hideZoom?: boolean;
  /** Whether to hide the fit view controls. */
  hideFitView?: boolean;
  /** Whether to hide the interactive controls. */
  hideInteractive?: boolean;
}

const DEFAULT_LABELS = {
  fitView: "Fit view",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  interactive: "Interactive",
};

const selector = (state: ReactFlowState) => ({
  isInteractive:
    state.nodesDraggable || state.nodesConnectable || state.elementsSelectable,
  minZoomReached: state.transform[2] <= state.minZoom,
  maxZoomReached: state.transform[2] >= state.maxZoom,
});

export const HvFlowControls = ({
  onZoomIn: onZoomInProp,
  onZoomOut: onZoomOutProp,
  onFitView: onFitViewProp,
  labels: labelsProps,
  hideInteractive,
  hideFitView,
  hideZoom,
  position = "bottom-center",
  orientation = "horizontal",
  onInteractiveChange,
  fitViewOptions,
  children,
  ...others
}: HvFlowControlsProps) => {
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(
    selector,
    shallow,
  );
  const store = useStoreApi();
  const { zoomIn, zoomOut, fitView } = useFlowInstance();

  const labels = useLabels(DEFAULT_LABELS, labelsProps);

  const handleZoomIn = () => {
    zoomIn();
    onZoomInProp?.();
  };

  const handleZoomOut = () => {
    zoomOut();
    onZoomOutProp?.();
  };

  const handleFitView = () => {
    fitView(fitViewOptions);
    onFitViewProp?.();
  };

  const handleInteractive = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });

    onInteractiveChange?.(!isInteractive);
  };

  return (
    <Panel position={position} {...others}>
      <HvMultiButton vertical={orientation === "vertical"}>
        {!hideZoom && (
          <HvButton
            icon
            title={labels?.zoomIn}
            onClick={handleZoomIn}
            disabled={maxZoomReached}
          >
            <ZoomIn />
          </HvButton>
        )}
        {!hideZoom && (
          <HvButton
            icon
            title={labels?.zoomOut}
            onClick={handleZoomOut}
            disabled={minZoomReached}
          >
            <ZoomOut />
          </HvButton>
        )}
        {!hideFitView && (
          <HvButton icon title={labels?.fitView} onClick={handleFitView}>
            <Focus />
          </HvButton>
        )}
        {!hideInteractive && (
          <HvButton
            icon
            title={labels?.interactive}
            onClick={handleInteractive}
          >
            {isInteractive ? <Unlock /> : <Lock />}
          </HvButton>
        )}
        {children}
      </HvMultiButton>
    </Panel>
  );
};
