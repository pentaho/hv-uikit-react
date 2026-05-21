import { useCallback, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvDatePicker } from "../../DatePicker";
import { HvWarningText } from "../../FormElement";
import { HvTimePicker, type HvTimePickerValue } from "../../TimePicker";
import { uniqueId } from "../../utils/helpers";
import { useQueryBuilderContext } from "../Context";

function formatDate(date?: Date) {
  if (!date) return undefined;
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  return d.toISOString().slice(0, 10);
}

function formatTime(time?: HvTimePickerValue) {
  if (!time) return undefined;
  const { hours, minutes, seconds } = time;
  const date = new Date(Date.UTC(2020, 8, 8, hours, minutes, seconds));
  return date.toISOString().slice(11, 19);
}

function parseDate(date?: string) {
  return date ? new Date(date) : undefined;
}

function parseTime(time: string): HvTimePickerValue | null {
  if (!time) return null;

  const parts = time.split(":");

  return {
    hours: Number(parts[0]),
    minutes: Number(parts[1]),
    seconds: Number(parts[2]) || 0,
  };
}

const { useClasses } = createClasses("HvQueryBuilderDateTimeValue", {
  root: {
    display: "flex",
    flexDirection: "column",
  },
  row: {},
  vertical: {
    display: "flex",
    flexDirection: "column",
  },
  horizontal: {
    display: "flex",

    "& > div:not(:last-child)": {
      marginRight: theme.space.md,
    },
  },
  isMdDown: {
    "& > div:not(:last-child)": {
      marginRight: `calc(${theme.space.md} / 2)`,
    },
  },
  datePicker: {
    flex: 1,
  },
  timePicker: {
    flex: 1,
  },
});

export interface DateTimeValueProps {
  id: React.Key;
  operator?: string;
  value?: any;
  initialTouched?: boolean;
}

export const DateTimeValue = ({
  id,
  operator,
  value: valueProp = {},
  initialTouched = false,
}: DateTimeValueProps) => {
  const { classes, cx } = useClasses();

  const { breakpoints } = useTheme();
  const isMdDown = useMediaQuery(breakpoints.down("md"));
  const isRange = operator === "range";

  const { labels, dispatchAction, readOnly } = useQueryBuilderContext();

  const elementId = uniqueId(`datetime${id}`);

  const [touchedDate, setTouchedDate] = useState(initialTouched);
  const [touchedTime, setTouchedTime] = useState(initialTouched);
  const [touchedEndDate, setTouchedEndDate] = useState(initialTouched);
  const [touchedEndTime, setTouchedEndTime] = useState(initialTouched);

  const onDateChange = useCallback(
    (data?: Date) => {
      setTouchedDate(true);

      const date = formatDate(data);
      const oldValue = !isRange ? valueProp?.date : valueProp?.start?.date;

      if (date !== oldValue) {
        let value;
        if (!isRange) {
          value = {
            date,
            time: valueProp?.time,
          };
        } else {
          value = {
            start: {
              date,
              time: valueProp?.start?.time,
            },
            end: valueProp?.end,
          };
        }

        dispatchAction({
          type: "set-value",
          id,
          value,
        });
      }
    },
    [dispatchAction, id, isRange, valueProp],
  );

  const onTimeChange = useCallback(
    (data: HvTimePickerValue) => {
      setTouchedTime(true);

      const time = formatTime(data);
      const oldValue = !isRange ? valueProp?.time : valueProp?.start?.time;

      if (time !== oldValue) {
        let value;
        if (!isRange) {
          value = {
            date: valueProp?.date,
            time,
          };
        } else {
          value = {
            start: {
              date: valueProp?.start?.date,
              time,
            },
            end: valueProp?.end,
          };
        }

        dispatchAction({
          type: "set-value",
          id,
          value,
        });
      }
    },
    [dispatchAction, id, isRange, valueProp],
  );

  const onEndDateChange = useCallback(
    (data?: Date) => {
      setTouchedEndDate(true);

      const date = formatDate(data);
      if (date !== valueProp?.end?.date) {
        const value = {
          start: valueProp?.start,
          end: {
            date,
            time: valueProp?.end?.time,
          },
        };

        dispatchAction({
          type: "set-value",
          id,
          value,
        });
      }
    },
    [dispatchAction, id, valueProp],
  );

  const onEndTimeChange = useCallback(
    (data: HvTimePickerValue) => {
      setTouchedEndTime(true);

      const time = formatTime(data);
      if (time !== valueProp?.end?.time) {
        const value = {
          start: valueProp?.start,
          end: {
            date: valueProp?.end?.date,
            time,
          },
        };

        dispatchAction({
          type: "set-value",
          id,
          value,
        });
      }
    },
    [dispatchAction, id, valueProp],
  );

  const startDate = isRange ? valueProp?.start?.date : valueProp?.date;
  const datePickerValue = useMemo(() => parseDate(startDate), [startDate]);
  const datePickerStatus = datePickerValue != null ? "valid" : "invalid";

  const startTime = (isRange ? valueProp?.start?.time : valueProp?.time) ?? "";
  const timePickerValue = useMemo(() => parseTime(startTime), [startTime]);
  const timePickerStatus = timePickerValue != null ? "valid" : "invalid";

  const endDate = isRange ? valueProp?.end?.date : null;
  const endDatePickerValue = useMemo(() => parseDate(endDate), [endDate]);

  const endTime = isRange ? valueProp?.end?.time : null;
  const endTimePickerValue = useMemo(() => parseTime(endTime), [endTime]);

  const dateStatus = !touchedDate ? "standBy" : datePickerStatus;
  const timeStatus = !touchedTime ? "standBy" : timePickerStatus;

  const endDateIsBefore =
    startDate != null && endDate != null && endDate < startDate;

  const endTimeIsBeforeOrSame =
    startDate != null &&
    endDate != null &&
    endDate === startDate &&
    startTime != null &&
    endTime != null &&
    endTime <= startTime;

  const endDateTimeIsBefore = endDateIsBefore || endTimeIsBeforeOrSame;

  const endDatePickerStatus =
    endDatePickerValue == null || endDateTimeIsBefore ? "invalid" : "valid";
  const endDateStatus = !touchedEndDate ? "standBy" : endDatePickerStatus;

  const endTimePickerStatus =
    endTimePickerValue == null || endDateTimeIsBefore ? "invalid" : "valid";
  const endTimeStatus = !touchedEndTime ? "standBy" : endTimePickerStatus;

  return (
    <div className={classes.root}>
      <div
        className={cx(classes.row, classes.horizontal, {
          [classes.isMdDown]: isMdDown,
        })}
      >
        <HvDatePicker
          className={classes.datePicker}
          name={`${elementId}-date`}
          required
          status={dateStatus}
          statusMessage={labels.rule.value.datetime.validation.required}
          label={
            isRange
              ? labels.rule.value.datetime.startDateLabel
              : labels.rule.value.datetime.dateLabel
          }
          placeholder={
            isRange
              ? labels.rule.value.datetime.startDatePlaceholder
              : labels.rule.value.datetime.datePlaceholder
          }
          value={datePickerValue}
          onChange={onDateChange}
          readOnly={readOnly}
        />
        <HvTimePicker
          className={classes.timePicker}
          timeFormat="24"
          name={`${elementId}-time`}
          required
          status={timeStatus}
          statusMessage={labels.rule.value.datetime.validation.required}
          label={
            isRange
              ? labels.rule.value.datetime.startTimeLabel
              : labels.rule.value.datetime.timeLabel
          }
          placeholder={
            isRange
              ? labels.rule.value.datetime.startTimePlaceholder
              : labels.rule.value.datetime.timePlaceholder
          }
          value={timePickerValue || undefined}
          onChange={onTimeChange}
          onToggle={(_evt, open) => {
            if (!open && !touchedTime) {
              setTouchedTime(true);
            }
          }}
          readOnly={readOnly}
        />
      </div>
      {isRange && (
        <div className={cx(classes.row, classes.vertical)}>
          <div
            className={cx(classes.horizontal, {
              [classes.isMdDown]: isMdDown,
            })}
          >
            <HvDatePicker
              className={classes.datePicker}
              name={`${elementId}-endDate`}
              required
              status={endDateStatus}
              statusMessage={labels.rule.value.datetime.validation.required}
              aria-errormessage={
                endDateTimeIsBefore ? `${elementId}-combined-error` : undefined
              }
              label={labels.rule.value.datetime.endDateLabel}
              placeholder={labels.rule.value.datetime.endDatePlaceholder}
              value={endDatePickerValue}
              onChange={onEndDateChange}
              readOnly={readOnly}
            />
            <HvTimePicker
              className={classes.timePicker}
              timeFormat="24"
              name={`${elementId}-endTime`}
              required
              status={endTimeStatus}
              statusMessage={labels.rule.value.datetime.validation.required}
              aria-errormessage={
                endDateTimeIsBefore ? `${elementId}-combined-error` : undefined
              }
              label={labels.rule.value.datetime.endTimeLabel}
              placeholder={labels.rule.value.datetime.endTimePlaceholder}
              value={endTimePickerValue || undefined}
              onChange={onEndTimeChange}
              onToggle={(_evt, open) => {
                if (!open && !touchedEndTime) {
                  setTouchedEndTime(true);
                }
              }}
              readOnly={readOnly}
            />
          </div>
          <HvWarningText
            disableBorder
            id={`${elementId}-combined-error`}
            isVisible={endDateTimeIsBefore}
          >
            {labels.rule.value.datetime.validation.invalidInterval}
          </HvWarningText>
        </div>
      )}
    </div>
  );
};
