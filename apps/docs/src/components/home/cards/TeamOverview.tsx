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
  HvAvatar,
  HvButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { Card } from "./Card";

const teamData = [
  {
    name: "Alice Johnson",
    role: "Lead Data Scientist",
    imgSrc: "https://i.imgur.com/bE7vg3N.png",
  },
  {
    name: "Bob Martinez",
    role: "Data Engineer",
    imgSrc: "https://i.imgur.com/56Eeg1g.png",
  },
  {
    name: "Carla Singh",
    role: "Business Analyst",
    imgSrc: "https://i.imgur.com/6sYhSb6.png",
  },
  {
    name: "David Kim",
    role: "Cloud Architect",
    imgSrc: "https://i.imgur.com/ea22egF.png",
  },
];

export const TeamOverview = () => (
  <Card
    title="Data Team Overview"
    subtitle="Meet the key players driving data strategy and execution."
  >
    <div className="space-y-2">
      {teamData.map(({ name, role, imgSrc }) => (
        <div key={name} className="flex items-center space-x-5">
          <HvAvatar src={imgSrc} alt={`${name}'s Avatar`} size="md" />
          <div className="flex-1">
            <HvTypography variant="captionLabel">{name}</HvTypography>
            <HvTypography variant="caption1" className="text-primary">
              {role}
            </HvTypography>
          </div>
          <HvButton
            icon
            variant="primaryGhost"
            aria-label={`View profile of ${name}`}
          >
            <div className="i-ph-arrow-square-out" />
          </HvButton>
        </div>
      ))}
    </div>
  </Card>
);
