import styled from "@emotion/styled";

export const MetadataContainer = styled("div")({
  "--targetWidth": "360px",
  maxWidth: "var(--targetWidth)",
  "& > :not(:first-of-type)": {
    marginTop: -1,
  },
  "& > *": {
    borderRadius: 0,
  },
});
