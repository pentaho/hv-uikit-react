import { forwardRef, useRef } from "react";
import { useDateSegment } from "@react-aria/datepicker";
import type {
  DateFieldState,
  DateSegment,
  SegmentType,
} from "@react-stately/datepicker";

import type { HvBaseProps } from "../types/generic";

/** Convert `Date` into `hh:mm:ss` format */
const getDateValue = (date: any) => {
  if (!date) return "";
  const { hour, minute, second } = date;

  return [hour, minute, second]
    .map((el) => String(el).padStart(2, "0"))
    .join(":");
};

const PlaceholderSegment = ({
  segment,
  state,
  placeholder,
}: {
  segment: DateSegment;
  state: DateFieldState;
  placeholder?: string;
}) => {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div ref={ref} {...segmentProps}>
      {(() => {
        if (segment.type === "literal") return segment.text;
        if (segment.isPlaceholder) return placeholder ?? segment.text;
        return segment.text.padStart(2, "0");
      })()}
    </div>
  );
};

export interface PlaceholderProps extends HvBaseProps<HTMLDivElement> {
  name?: string;
  state: DateFieldState;
  placeholders: Partial<Record<SegmentType, string>>;
}

export const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  function Placeholder(props, ref) {
    const { name, state, placeholders, onKeyDown, ...others } = props;
    const { value, segments } = state;

    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={ref}
          onKeyDown={(event) => {
            // stop ArrowDown from opening dropdown
            event.stopPropagation();
            onKeyDown?.(event);
          }}
          {...others}
        >
          {name && (
            <input type="hidden" name={name} value={getDateValue(value)} />
          )}
          {segments.map((segment) => (
            <PlaceholderSegment
              key={segment.type}
              segment={segment}
              state={state}
              placeholder={placeholders[segment.type]}
            />
          ))}
        </div>
      </>
    );
  },
);
