import {
  Children,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useElementSize } from "usehooks-ts";
import {
  HvDialogContent,
  HvLoadingContainer,
  type ExtractNames,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";

import { HvWizardContext, type HvWizardTabs } from "../WizardContext";
import { staticClasses, useClasses } from "./WizardContent.styles";

export { staticClasses as wizardContentClasses };

export type HvWizardContentClasses = ExtractNames<typeof useClasses>;

export interface HvWizardContentProps extends HvBaseProps {
  /** Forces minimum height to the component. */
  fixedHeight?: boolean;
  /** Whether the loading animation is shown. */
  loading?: boolean;
  /** The content of the summary. */
  summaryContent?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied to the empty state Wizard. */
  classes?: HvWizardContentClasses;
}

type ChildElement = React.ReactElement<HvWizardTabs>;

const DRAWER_PERCENTAGE = 0.3;
const DRAWER_MIN_WIDTH = 280;

export const HvWizardContent = ({
  classes: classesProp,
  fixedHeight = false,
  loading = false,
  children,
  summaryContent,
}: HvWizardContentProps) => {
  const { classes, cx } = useClasses(classesProp);

  const { context, setContext, summary, tab } = useContext(HvWizardContext);

  const arrayChildren = Children.toArray(children) as ChildElement[];

  const summaryRef = useRef<HTMLElement | undefined>(undefined);
  const resizedRef = useRef({ height: 0, width: 0 });
  const [containerRef, sizes] = useElementSize();

  const [summaryHeight, setSummaryHeight] = useState(0);
  const [summaryWidth, setSummaryWidth] = useState(0);
  const [summaryLeft, setSummaryLeft] = useState(0);

  const updateSummaryMeasures = useCallback(({ height = 0, width = 0 }) => {
    const drawerWidth = width * DRAWER_PERCENTAGE;
    setSummaryHeight(height);
    setSummaryWidth(Math.max(drawerWidth, DRAWER_MIN_WIDTH));
    setSummaryLeft(width - Math.max(drawerWidth, DRAWER_MIN_WIDTH));

    resizedRef.current = {
      height,
      width,
    };
  }, []);

  useEffect(() => {
    const pageHeight = summaryRef.current?.getBoundingClientRect?.()?.height;
    if (
      (summary && sizes.height !== resizedRef.current.height) ||
      sizes.width !== resizedRef.current.width
    ) {
      updateSummaryMeasures(sizes);
    }

    if (pageHeight && sizes.height !== pageHeight) {
      updateSummaryMeasures({
        width: sizes.width,
        height: pageHeight,
      });
    }
  }, [tab, sizes, summary, updateSummaryMeasures]);

  useEffect(() => {
    const initialContext = arrayChildren.reduce<HvWizardTabs>(
      (acc, child, index) => {
        const invalid =
          "mustValidate" in child.props && child.props.mustValidate === true
            ? false
            : null;
        const valid = invalid ?? (index === 0 || null);
        acc[index] = { ...child.props, form: {}, valid, touched: index === 0 };
        return acc;
      },
      {},
    );

    setContext(initialContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab && !context[tab]?.touched) {
      setContext((oldContext) =>
        Object.entries(oldContext).reduce<HvWizardTabs>(
          (acc, [key, childState]) => {
            acc[Number(key)] =
              +key <= tab
                ? {
                    ...childState,
                    touched: true,
                    valid: childState?.valid ?? true,
                  }
                : childState;
            return acc;
          },
          {},
        ),
      );
    }
  }, [tab, context, setContext]);

  const translateX = summaryWidth ? summaryWidth + 10 : 450;

  return (
    <div
      className={classes.summaryRef}
      ref={(el) => {
        containerRef(el);
        if (el) {
          summaryRef.current = el;
        }
      }}
    >
      {summary !== null && (
        <div className={classes.summarySticky}>
          <div
            className={classes.summaryContainer}
            style={{
              left: summaryLeft,
              width: summaryWidth,
              height: summaryHeight,
              transform: `translate(${summary ? 0 : translateX}px, 0)`,
            }}
          >
            {summaryContent}
          </div>
        </div>
      )}
      <HvLoadingContainer hidden={!loading}>
        <HvDialogContent
          className={cx(classes.contentContainer, {
            [classes.fixedHeight]: fixedHeight,
          })}
          indentContent
        >
          {Children.map(arrayChildren, (child, index) => {
            if (index !== tab) return null;
            return cloneElement(child as React.ReactElement, { tab });
          })}
        </HvDialogContent>
      </HvLoadingContainer>
    </div>
  );
};
