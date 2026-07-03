import {
  HvActionBar,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  Level0Good,
  Level3Bad,
  LocationPin,
  WorldGlobe,
} from "@hitachivantara/uikit-react-icons";

const subheader = (
  <div className="flex items-center">
    <LocationPin size="XS" style={{ width: 16, height: 16 }} />
    <HvTypography variant="caption2">Portugal</HvTypography>
  </div>
);

export const Variants = () => {
  return (
    <div className="flex flex-wrap gap-sm">
      <HvCard
        className="flex flex-col w-380px"
        bgcolor="bgContainer"
        statusColor="positive"
        icon={<Level0Good iconSize="S" color="positive" />}
      >
        <HvCardMedia
          component="img"
          alt="Nature"
          height={140}
          image="https://pentaho.github.io/assets/madeira.webp"
        />
        <HvCardContent>
          <HvTypography>
            Madeira is a stunning Portuguese archipelago known for its lush
            landscapes, mild climate, and rich wine, located in the North
            Atlantic Ocean.
          </HvTypography>
        </HvCardContent>
      </HvCard>

      <HvCard
        className="flex flex-col items-stretch h-fit w-380px"
        bgcolor="bgContainer"
        statusColor="negative"
        icon={<Level3Bad color="negative" />}
      >
        <HvCardHeader
          title={
            <HvTypography variant="title4">The island of Madeira</HvTypography>
          }
          subheader={subheader}
        />
        <HvCardMedia
          className="rounded-b-inherit"
          component="img"
          alt="Nature"
          height={140}
          image="https://pentaho.github.io/assets/madeira.webp"
        />
      </HvCard>

      <HvCard className="flex flex-col w-380px">
        <HvCardHeader
          title="The island of Madeira"
          subheader={subheader}
          icon={<WorldGlobe />}
        />
      </HvCard>

      <HvCard className="flex flex-col w-380px" bgcolor="bgContainer">
        <HvCardHeader
          title="The island of Madeira"
          subheader={subheader}
          icon={<WorldGlobe />}
        />
        <HvCardContent>
          <HvTypography>
            Madeira is a stunning Portuguese archipelago known for its lush
            landscapes, mild climate, and rich wine, located in the North
            Atlantic Ocean.
          </HvTypography>
        </HvCardContent>
      </HvCard>

      <HvCard
        className="flex flex-col w-380px"
        bgcolor="bgContainer"
        statusColor="cat1"
      >
        <HvCardHeader
          title={
            <HvTypography variant="title4">The island of Madeira</HvTypography>
          }
          subheader={subheader}
          icon={<WorldGlobe />}
        />
        <HvActionBar className="justify-between mt-auto">
          <HvButton variant="secondaryGhost">Add to Wishlist</HvButton>
          <HvButton variant="secondarySubtle">Book Now</HvButton>
        </HvActionBar>
      </HvCard>

      <HvCard
        className="flex flex-col w-380px"
        bgcolor="bgContainer"
        statusColor="cat2"
      >
        <HvCardContent>
          <HvTypography>
            Madeira is a stunning Portuguese archipelago known for its lush
            landscapes, mild climate, and rich wine, located in the North
            Atlantic Ocean.
          </HvTypography>
        </HvCardContent>
        <HvActionBar className="justify-between mt-auto">
          <HvButton variant="secondaryGhost">Add to Wishlist</HvButton>
          <HvButton variant="secondarySubtle">Book Now</HvButton>
        </HvActionBar>
      </HvCard>
    </div>
  );
};
