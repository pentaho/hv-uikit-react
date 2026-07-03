import { css } from "@emotion/css";
import {
  HvGrid,
  HvInput,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Heart, Palette } from "@hitachivantara/uikit-react-icons";

const classes = {
  root: css({
    height: "100%",
    padding: theme.space.xl,
    background: `linear-gradient(70deg, ${theme.colors.bgPage} 55%, transparent 55%), linear-gradient(180deg, ${theme.colors.primary}, #000)`,
  }),
  glossaryContainer: css({
    margin: theme.spacing("sm", 0),
    display: "flex",
    flexDirection: "column",
    gap: theme.space.xs,
  }),
  imageContainer: css({
    display: "flex",
    alignItems: "center",

    img: { maxHeight: "450px" },
  }),
};

const Welcome = () => {
  return (
    <div className={classes.root}>
      <HvGrid container>
        <HvGrid item xs={6}>
          <HvGrid container>
            <HvGrid item xs={8}>
              <HvTypography variant="title1">Welcome to UI Kit</HvTypography>
            </HvGrid>
            <HvGrid item xs={8}>
              <HvTypography variant="label">
                UI Kit is a composable and accessible component library that
                gives you the foundation to build your application faster and
                consistently.
              </HvTypography>
            </HvGrid>
            <HvGrid item xs={8}>
              <HvInput type="search" placeholder="What are you looking for?" />
            </HvGrid>
            <HvGrid item xs={6}>
              <div className={classes.glossaryContainer}>
                <Palette iconSize="M" />
                <HvTypography variant="title4" component="p">
                  Themeable
                </HvTypography>
                <HvTypography>
                  Use available Design System or customize it to match your
                  design needs.
                </HvTypography>
              </div>
            </HvGrid>
            <HvGrid item xs={6}>
              <div className={classes.glossaryContainer}>
                <Heart iconSize="M" />
                <HvTypography variant="title4" component="p">
                  Community
                </HvTypography>
                <HvTypography>
                  We welcome all feedback in order to produce the best
                  experience for our users.
                </HvTypography>
              </div>
            </HvGrid>
          </HvGrid>
        </HvGrid>
        <HvGrid item xs={6} display="flex">
          <div className={classes.imageContainer}>
            <img
              alt="Monitor showing a dashboard built with UI Kit components"
              src="https://pentaho.github.io/assets/template-preview.webp"
            />
          </div>
        </HvGrid>
        <HvGrid item xs={12}>
          <HvTypography
            link
            component="a"
            href="https://pentaho.github.io/uikit-docs/master/"
          >
            More details
          </HvTypography>
        </HvGrid>
      </HvGrid>
    </div>
  );
};

export { Welcome as Component };

export default Welcome;
