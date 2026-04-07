import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvButton,
  HvCard,
  HvInput,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import {
  Cluster,
  Level0Good,
  PaintBucket,
  Table,
  TopXS,
} from "@hitachivantara/uikit-react-icons";
import {
  HvBlade,
  HvBlades,
  type HvBladesProps,
} from "@hitachivantara/uikit-react-lab";

const meta: Meta<typeof HvBlades> = {
  title: "Lab/Blades/Blades",
  component: HvBlades,
};
export default meta;

export const Main: StoryObj<HvBladesProps> = {
  args: {
    expanded: undefined,
    defaultExpanded: undefined,
    atMostOneExpanded: true,
    atLeastOneExpanded: true,
    fullWidthBlades: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  render: (args) => {
    const classes = {
      blueContainer: css({
        background:
          "linear-gradient(259.09deg, rgba(88, 181, 231, 0) 53.36%, rgba(88, 181, 231, 0.095) 64.19%, rgba(14, 142, 211, 0.205) 90.68%)",
        backgroundSize: "960px auto",
        backgroundRepeat: "no-repeat",
      }),
      greenContainer: css({
        background:
          "linear-gradient(259.09deg, rgba(46, 234, 110, 0) 53.36%, rgba(46, 234, 110, 0.095) 64.19%, rgba(46, 234, 110, 0.205) 90.68%)",
        backgroundSize: "960px auto",
        backgroundRepeat: "no-repeat",
      }),
      pinkContainer: css({
        background:
          "linear-gradient(258.35deg, rgba(239, 73, 203, 0) 52.35%, rgba(239, 73, 203, 0.095) 68.46%, rgba(239, 73, 203, 0.205) 90.66%)",
        backgroundSize: "960px auto",
        backgroundRepeat: "no-repeat",
      }),

      root: css({
        minWidth: 77,
      }),
      button: css({
        minWidth: 75,
      }),
      buttonLabel: css({
        padding: theme.spacing("xs"),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }),

      card: css({
        width: 280,
        marginRight: 20,
      }),
      cardContent: css({
        padding: "12px 16px 22px 16px",
      }),
      cardTitle: css({ padding: "0px 24px 16px 0px" }),
      cardValue: css({
        display: "flex",
        alignItems: "center",
      }),
      kpiValue: css({ paddingRight: "10px" }),
    };

    return (
      <HvBlades style={{ height: 300 }} {...args}>
        <HvBlade
          label={
            <div className={classes.buttonLabel}>
              <div style={{ textAlign: "center" }}>
                <Cluster style={{ display: "inline-flex" }} />
                <HvTypography variant="caption2">Connections</HvTypography>
              </div>
              <HvTypography variant="title2">25</HvTypography>
            </div>
          }
          classes={{
            root: classes.root,
            button: classes.button,
            container: classes.blueContainer,
          }}
        >
          <div
            style={{
              padding: 50,
              display: "flex",
              width: 700,
            }}
          >
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
          </div>
        </HvBlade>
        <HvBlade
          label={
            <div className={classes.buttonLabel}>
              <div style={{ textAlign: "center" }}>
                <PaintBucket style={{ display: "inline-flex" }} />
                <HvTypography variant="caption2">Buckets</HvTypography>
              </div>
              <HvTypography variant="title2">32</HvTypography>
            </div>
          }
          classes={{
            root: classes.root,
            button: classes.button,
            container: classes.greenContainer,
          }}
        >
          <div
            style={{
              padding: 50,
              display: "flex",
              width: 700,
            }}
          >
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
          </div>
        </HvBlade>
        <HvBlade
          label={
            <div className={classes.buttonLabel}>
              <div style={{ textAlign: "center" }}>
                <Table style={{ display: "inline-flex" }} />
                <HvTypography variant="caption2">Tables</HvTypography>
              </div>
              <HvTypography variant="title2">41</HvTypography>
            </div>
          }
          classes={{
            root: classes.root,
            button: classes.button,
            container: classes.pinkContainer,
          }}
        >
          <div
            style={{
              padding: 50,
              display: "flex",
              width: 700,
            }}
          >
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
            <HvCard
              className={classes.card}
              statusColor="positive"
              icon={<Level0Good title="Good" color="positive" />}
            >
              <div className={classes.cardContent}>
                <HvTypography className={classes.cardTitle} variant="label">
                  Avg. service time
                </HvTypography>
                <div className={classes.cardValue}>
                  <HvTypography className={classes.kpiValue} variant="title2">
                    12 414
                  </HvTypography>
                  <TopXS title="Up" color="positive" />
                  <HvTypography>10%</HvTypography>
                </div>
              </div>
            </HvCard>
          </div>
        </HvBlade>
      </HvBlades>
    );
  },
};

export const Controlled: StoryObj<HvBladesProps> = {
  render: () => {
    const [expandedState, setExpandedState] = useState([0]);
    const handleToggle = (key: number) => {
      const newValue = [...expandedState];
      if (expandedState.includes(key)) {
        newValue.splice(newValue.indexOf(key), 1);
      } else {
        newValue.push(key);
      }

      setExpandedState(newValue);
    };
    const handleAll = (option: boolean) => {
      setExpandedState(option ? [0, 1, 2] : []);
    };

    const classes = {
      button: css({
        writingMode: "vertical-rl",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: "rotate(-180deg)",
      }),
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: 10,
          }}
        >
          <HvButton variant="secondarySubtle" onClick={() => handleToggle(0)}>
            Personal Information
          </HvButton>
          <HvButton variant="secondarySubtle" onClick={() => handleToggle(1)}>
            Billing Address
          </HvButton>
          <HvButton variant="secondarySubtle" onClick={() => handleToggle(2)}>
            Shipping Address
          </HvButton>
          <HvButton variant="secondarySubtle" onClick={() => handleAll(false)}>
            Close all
          </HvButton>
          <HvButton variant="secondarySubtle" onClick={() => handleAll(true)}>
            Expand all
          </HvButton>
        </div>
        <HvBlades
          expanded={expandedState}
          onChange={(e, newState) => setExpandedState(newState)}
          style={{ maxHeight: 300 }}
        >
          <HvBlade
            label="Personal Information"
            classes={{
              button: classes.button,
            }}
          >
            <form style={{ padding: theme.spacing("xs", "sm") }}>
              <HvInput label="Name" placeholder="Insert first name" required />
              <HvInput label="Email" placeholder="Insert your email" required />
              <HvInput label="Phone" placeholder="Insert your phone number" />
              <HvInput label="Extension" placeholder="Insert phone extension" />
              <HvInput label="Country" placeholder="Insert country name" />
              <HvInput
                label="City/Province"
                placeholder="Insert province name"
              />
            </form>
          </HvBlade>
          <HvBlade
            label="Billing Address"
            classes={{
              button: classes.button,
            }}
          >
            <form style={{ padding: theme.spacing("xs", "sm") }}>
              <HvInput label="Address 1" placeholder="Insert first name" />
              <HvInput label="Address 2" placeholder="Insert address" />
              <HvInput label="City" placeholder="Insert city name" />
              <HvInput label="State" placeholder="Insert state" />
              <HvInput label="Zip Code" placeholder="Insert code" />
            </form>
          </HvBlade>
          <HvBlade
            label="Shipping Address"
            classes={{
              button: classes.button,
            }}
          >
            <form style={{ padding: theme.spacing("xs", "sm") }}>
              <HvInput label="Address 1" placeholder="Insert first name" />
              <HvInput label="Address 2" placeholder="Insert address" />
              <HvInput label="City" placeholder="Insert city name" />
              <HvInput label="State" placeholder="Insert state" />
              <HvInput label="Zip Code" placeholder="Insert code" />
            </form>
          </HvBlade>
        </HvBlades>
      </>
    );
  },
};
