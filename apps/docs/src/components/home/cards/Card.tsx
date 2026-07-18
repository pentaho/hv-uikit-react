/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  media?: React.ReactNode;
};

export const Card = ({ children, title, subtitle, media, icon }: CardProps) => {
  return (
    <HvCard className="dark:!outline-border" bgcolor="bgContainer">
      <HvCardHeader
        title={<HvTypography variant="title3">{title}</HvTypography>}
        subheader={<HvTypography variant="caption1">{subtitle}</HvTypography>}
        icon={icon}
        className="mx-xs mt-xs"
      />
      {media && <HvCardMedia className="my-xs">{media}</HvCardMedia>}
      <HvCardContent className="!px-md">{children}</HvCardContent>
    </HvCard>
  );
};
