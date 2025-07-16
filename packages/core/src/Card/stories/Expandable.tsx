import { useId, useState } from "react";
import { css } from "@emotion/css";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvIconButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Cloud, DropDownXS, User } from "@hitachivantara/uikit-react-icons";

const classes = {
  card: css({
    width: 380,
  }),
  subheader: css({
    display: "flex",
    alignItems: "center",
    "& > div": {
      width: 16,
      height: 16,
    },
  }),
};

export const Expandable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cardContentId = useId();

  return (
    <HvCard className={classes.card} bgcolor="bgContainer">
      <HvCardHeader
        title={<HvTypography variant="title4">Header Title</HvTypography>}
        subheader={
          <div className={classes.subheader}>
            <User iconSize="XS" />
            <HvTypography variant="caption2">Optional info</HvTypography>
          </div>
        }
        icon={<Cloud />}
      />
      <HvCardContent
        id={cardContentId}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <HvTypography>This is my hidden content</HvTypography>
      </HvCardContent>

      <HvIconButton
        title={isOpen ? "Collapse" : "Expand"}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={cardContentId}
        style={{ width: "100%", height: 16, display: "flex", paddingBottom: 0 }}
      >
        <DropDownXS rotate={isOpen} size="xs" />
      </HvIconButton>
    </HvCard>
  );
};
