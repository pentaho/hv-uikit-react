import { useEffect, useMemo, useRef, useState } from "react";
import { hexToRgba, rgbToHex, validHex } from "@uiw/color-convert";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvInput } from "../../Input";

const { useClasses } = createClasses("HvColorPickerFields", {
  root: {
    width: "100%",
    display: "flex",
    gap: theme.space.xxs,
  },
  single: {
    maxWidth: "50px",
    "& input": {
      marginLeft: 5,
      marginRight: 5,
    },
    "& label": {
      paddingLeft: 5,
    },
  },
  double: {
    maxWidth: "82px",
    paddingRight: theme.space.xxs,
    "& input": {
      textTransform: "uppercase",
      marginLeft: 5,
      marginRight: 5,
    },
    "& label": {
      paddingLeft: 5,
    },
  },
});

interface FieldsProps {
  className?: string;
  hex: string;
  onChange?: (hex: string) => void;
  classes?: ExtractNames<typeof useClasses>;
}

export const Fields = (props: FieldsProps) => {
  const {
    className,
    onChange,
    hex,
    classes: classesProp,
  } = useDefaultProps("HvColorPickerFields", props);
  const { classes, cx } = useClasses(classesProp);
  const rgb = useMemo(() => hexToRgba(hex), [hex]);

  const [internalHex, setInternalHex] = useState(hex);
  const [internalRed, setInternalRed] = useState(rgb?.r);
  const [internalGreen, setInternalGreen] = useState(rgb?.g);
  const [internalBlue, setInternalBlue] = useState(rgb?.b);

  const hexInputRef = useRef<HTMLInputElement>(null);
  const redInputRef = useRef<HTMLInputElement>(null);
  const greenInputRef = useRef<HTMLInputElement>(null);
  const blueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== hexInputRef.current) {
      setInternalHex(hex);
    }
  }, [hex]);

  useEffect(() => {
    if (document.activeElement !== redInputRef.current) {
      setInternalRed(rgb?.r);
    }

    if (document.activeElement !== greenInputRef.current) {
      setInternalGreen(rgb?.g);
    }

    if (document.activeElement !== blueInputRef.current) {
      setInternalBlue(rgb?.b);
    }
  }, [rgb]);

  const handleChange = (hex: string) => {
    if (!validHex(hex)) return;
    onChange?.(hex);
  };

  const onChangeRbg = ({ r, g, b }: { r?: string; g?: string; b?: string }) => {
    if (r) setInternalRed(Number(r));
    if (g) setInternalGreen(Number(g));
    if (b) setInternalBlue(Number(b));

    handleChange(
      rgbToHex({
        r: r ? Number(r) : rgb?.r,
        g: g ? Number(g) : rgb?.g,
        b: b ? Number(b) : rgb?.b,
      }),
    );
  };

  return (
    <div className={cx(classes.root, className)}>
      <HvInput
        ref={hexInputRef}
        className={classes.double}
        label="HEX"
        value={internalHex?.replace("#", "")}
        onChange={(event, value) => {
          setInternalHex(value);
          handleChange(value);
        }}
        onBlur={() => setInternalHex(hex)}
        disableClear
      />
      <HvInput
        ref={redInputRef}
        className={classes.single}
        label="R"
        value={internalRed}
        onChange={(event, value) => onChangeRbg({ r: value })}
        onBlur={() => setInternalRed(rgb?.r)}
        inputProps={{ type: "number", min: 0, max: 255 }}
        disableClear
      />
      <HvInput
        ref={greenInputRef}
        className={classes.single}
        label="G"
        value={internalGreen}
        onChange={(event, value) => onChangeRbg({ g: value })}
        onBlur={() => setInternalGreen(rgb?.g)}
        inputProps={{ type: "number", min: 0, max: 255 }}
        disableClear
      />
      <HvInput
        ref={blueInputRef}
        className={classes.single}
        label="B"
        value={internalBlue}
        onChange={(event, value) => onChangeRbg({ b: value })}
        onBlur={() => setInternalBlue(rgb?.b)}
        inputProps={{ type: "number", min: 0, max: 255 }}
        disableClear
      />
    </div>
  );
};
