import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  HvDropdownPanel,
  HvSearchInput,
  HvTag,
  type HvColorAny,
  type HvTagProps,
} from "@hitachivantara/uikit-react-core";

import { useClasses } from "./TagsList.styles";

const GAP = 8;

export interface TagsListProps {
  tags?: HvTagProps[];
  rows?: number;
  onDelete?: (tag: string) => void;
  readOnly?: boolean;
  color?: HvColorAny;
  searchable?: boolean;
}

export const TagsList = ({
  tags = [],
  rows = 3,
  onDelete,
  readOnly,
  color,
  searchable,
}: TagsListProps) => {
  const { classes } = useClasses();
  const [popperOpen, setPopperOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const [rowCounts, setRowCounts] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const recalculate = () => {
    const container = containerRef.current;
    const measureBox = measureRef.current;
    if (!container || !measureBox) return;

    const tagEls = Array.from(measureBox.children) as HTMLElement[];
    const numRows = rowsRef.current;

    // Last child is "+99" reserved for measurement
    const plusTagWidth =
      tagEls[tagEls.length - 1].getBoundingClientRect().width;
    const tagWidths = tagEls
      .slice(0, -1)
      .map((el) => el.getBoundingClientRect().width);

    const style = getComputedStyle(container);
    const containerWidth =
      container.getBoundingClientRect().width -
      Number.parseFloat(style.paddingLeft) -
      Number.parseFloat(style.paddingRight);

    const counts = Array.from<number>({ length: numRows }).fill(0);
    let rowUsed = 0;
    let currentRow = 0;

    for (let i = 0; i < tagWidths.length; i++) {
      const width = tagWidths[i];
      const tagsAfterThis = tagWidths.length - i - 1;
      const isLastRow = currentRow === numRows - 1;

      // On the last row, reserve space for "+X" unless everything remaining fits
      const needsPlusTag = isLastRow && tagsAfterThis > 0;
      const gapBefore = rowUsed === 0 ? 0 : GAP;
      const spaceNeeded =
        gapBefore + width + (needsPlusTag ? GAP + plusTagWidth : 0);

      if (rowUsed + spaceNeeded > containerWidth) {
        if (!isLastRow) {
          // Overflow to next row
          currentRow++;
          rowUsed = 0;
          i--; // retry this tag on the next row
          continue;
        } else {
          // Last row is full, stop
          break;
        }
      }

      rowUsed += gapBefore + width;
      counts[currentRow]++;
    }

    setRowCounts(counts);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => recalculate());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const waitForStyles = () => {
      const el = measureRef.current?.children[0] as HTMLElement;
      if (!el || el.getBoundingClientRect().width === 0) {
        requestAnimationFrame(waitForStyles);
      } else {
        recalculate();
      }
    };
    waitForStyles();
  }, [rows, tags]);

  const handleSearch = useCallback(
    (_: ChangeEvent<HTMLInputElement>, value: string) => {
      setSearchValue(value);
    },
    [],
  );

  const visibleCount = rowCounts.reduce((sum, c) => sum + c, 0);
  const hiddenCount = tags.length - visibleCount;

  const rowSlices = rowCounts.map((count, i) => {
    const start = rowCounts.slice(0, i).reduce((sum, c) => sum + c, 0);
    return tags.slice(start, start + count);
  });

  const nonEmptyRowSlices = rowSlices.filter((rowTags) => rowTags.length > 0);

  return (
    <>
      <div ref={containerRef} className={classes.container}>
        {nonEmptyRowSlices.map((rowTags, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={rowIndex} className={classes.row}>
            {rowTags.map((t, i) => (
              <HvTag
                key={`${t.label}-${i}`}
                label={t.label}
                color={t.color || color}
                {...(!readOnly && onDelete && t.id != null
                  ? { onDelete: () => onDelete(t.id!) }
                  : {})}
              />
            ))}
            {rowIndex === nonEmptyRowSlices.length - 1 && hiddenCount > 0 && (
              <HvTag
                label={`+${hiddenCount}`}
                color={color}
                onClick={() => setPopperOpen(true)}
                ref={anchorRef}
              />
            )}
          </div>
        ))}
      </div>

      <HvDropdownPanel
        variableWidth
        open={popperOpen}
        anchorEl={anchorRef.current}
        placement="bottom"
        onClickAway={() => setPopperOpen(false)}
        classes={{ panel: classes.panel }}
      >
        <>
          {searchable && (
            <HvSearchInput
              placeholder="Search..."
              className={classes.search}
              onChange={handleSearch}
            />
          )}
          <div className={classes.extraTags}>
            {tags
              .slice(visibleCount)
              .filter((t) =>
                searchValue
                  ? String(t.label)
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  : true,
              )
              .map((t, i) => (
                <HvTag
                  key={`${t.label}-${i}`}
                  label={t.label}
                  color={t.color || color}
                  {...(!readOnly && onDelete && t.id != null
                    ? { onDelete: () => onDelete(t.id!) }
                    : {})}
                />
              ))}
          </div>
        </>
      </HvDropdownPanel>

      {/* Hidden measurement rows */}
      <div className={classes.hidden} ref={measureRef}>
        {tags.map((t, i) => (
          <HvTag
            key={`${t.label}-${i}-hidden`}
            label={t.label}
            color={t.color || "primary"}
            {...(!readOnly && onDelete && t.id != null
              ? { onDelete: () => {} }
              : {})}
          />
        ))}
        <HvTag key="+99-hidden" label="+99" />
      </div>
    </>
  );
};
