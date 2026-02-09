import { useId, useRef, useState } from "react";
import {
  HvAdornment,
  HvBaseInput,
  HvBaseInputProps,
  HvFormElement,
  HvFormElementProps,
  HvFormStatus,
  HvInfoMessage,
  HvLabel,
  HvWarningText,
} from "@hitachivantara/uikit-react-core";
import { CloseXS, Success } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Form Element",
  component: HvFormElement,
});

export const Main = meta.story({
  args: {},
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    const [elementValue, setElementValue] = useState("");
    const [elementStatus, setElementStatus] = useState<HvFormStatus>("standBy");
    const [showCloseAdornment, setShowCloseAdornment] = useState(false);

    const inputId = useId();
    const clearButtonId = useId();
    const inputReference = useRef<HTMLElement>(null);

    const setElement = (value = "", setStatus = true) => {
      const hasNumber = /\d/.test(value);
      const isEmpty = !value || value.length === 0;

      if (setStatus) {
        setElementStatus(
          (hasNumber && "invalid") || (isEmpty && "standBy") || "valid",
        );
      }
      setShowCloseAdornment(!isEmpty);
      setElementValue(value);
    };

    const onFocusHandler: HvFormElementProps["onFocus"] = (event) => {
      const { type } = event.target as any;
      if (type === "button") return;
      if (
        !event.currentTarget.contains(document.activeElement) ||
        elementStatus !== "standBy"
      ) {
        setElementStatus("standBy");
        if (!showCloseAdornment && elementValue) {
          setShowCloseAdornment(true);
          return;
        }
        if (showCloseAdornment && !elementValue) {
          setShowCloseAdornment(false);
        }
      }
    };

    /** Extra validation is needed because of the close adornment. */
    const onBlurHandler: HvFormElementProps["onBlur"] = (event) => {
      if (
        event.relatedTarget === null ||
        event?.relatedTarget?.id !== clearButtonId
      ) {
        setElement((event.target as any).value);
        setShowCloseAdornment(false);
      }
    };

    const onMouseLeaveHandler: HvBaseInputProps["onMouseLeave"] = (event) => {
      if (!event.currentTarget.contains(document.activeElement))
        setShowCloseAdornment(false);
    };

    const onMouseEnterHandler = () => {
      if (elementValue) setShowCloseAdornment(true);
    };

    return (
      <HvFormElement
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        status={elementStatus}
      >
        <HvLabel label="First name">
          <HvInfoMessage>Do not put numbers.</HvInfoMessage>
          <HvBaseInput
            id={inputId}
            value={elementValue}
            inputRef={inputReference}
            placeholder="Insert your name"
            onChange={(event, value) => setElement(value, false)}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            endAdornment={
              <>
                <HvAdornment
                  id={clearButtonId}
                  isVisible={showCloseAdornment}
                  onClick={() => {
                    setElement("");
                    setTimeout(() => {
                      inputReference.current?.focus();
                    });
                  }}
                  icon={<CloseXS />}
                  aria-label="clear button"
                />
                <HvAdornment
                  showWhen="valid"
                  icon={<Success color="positive" />}
                />
              </>
            }
          />
        </HvLabel>
        <HvWarningText id="warning-text" disableBorder>
          Names do not contain numbers.
        </HvWarningText>
      </HvFormElement>
    );
  },
});

export const Invalid = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Form element propagating the invalid state to the input.",
      },
    },
  },
  render: () => {
    const inputId = useId();
    return (
      <HvFormElement status="invalid">
        <HvLabel htmlFor={inputId} label="First name">
          <HvInfoMessage>Do not put numbers.</HvInfoMessage>
          <HvBaseInput id={inputId} defaultValue="Albert2" />
        </HvLabel>
        <HvWarningText disableBorder>
          Names do not contain numbers.
        </HvWarningText>
      </HvFormElement>
    );
  },
});

export const Valid = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Form element propagating the valid state to the input.",
      },
    },
  },
  render: () => {
    const inputId = useId();

    return (
      <HvFormElement status="valid">
        <HvLabel htmlFor={inputId} label="First name">
          <HvInfoMessage>This will always be valid.</HvInfoMessage>
          <HvBaseInput
            id={inputId}
            defaultValue="Hello"
            endAdornment={
              <HvAdornment
                showWhen="valid"
                icon={<Success color="positive" />}
              />
            }
          />
        </HvLabel>
        <HvWarningText>Names do not contain numbers.</HvWarningText>
      </HvFormElement>
    );
  },
});

export const Disabled = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Form element propagating the disabled state to the input.",
      },
    },
  },
  render: () => {
    return (
      <HvFormElement disabled status="invalid">
        <HvLabel label="First name">
          <HvInfoMessage>Info message here</HvInfoMessage>
          <HvBaseInput placeholder="Insert your name" />
        </HvLabel>
        <HvWarningText>Names do not contain numbers.</HvWarningText>
      </HvFormElement>
    );
  },
});
