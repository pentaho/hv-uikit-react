import { forwardRef, useRef } from "react";
import { useDateSegment } from "react-aria/useDateField";
import type {
  DateFieldState,
  DateSegment,
  SegmentType,
} from "react-stately/useDateFieldState";

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
  value,
}: {
  segment: DateSegment;
  state: DateFieldState;
  value?: string;
}) => {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  // don't render special text-direction character
  if (segment.type === "literal" && segment.text === "\u{2066}") return;

  return (
    <div ref={ref} {...segmentProps}>
      {value}
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
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
        {segments.map((segment, i) => (
          <PlaceholderSegment
            key={segment.type === "literal" ? `literal-${i}` : segment.type}
            segment={segment}
            state={state}
            value={renderSegment(segment, placeholders[segment.type])}
          />
        ))}
      </div>
    );
  },
);

function renderSegment(segment: DateSegment, placeholder?: string) {
  if (segment.type === "literal") return segment.text;
  if (segment.isPlaceholder) return placeholder ?? segment.text;
  return segment.text.padStart(2, "0");
}
