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
import { useState } from "react";
import {
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCarousel,
  HvCarouselSlide,
  HvIconContainer,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const RELEASES = [
  {
    version: "v3.2",
    date: "Jun 2025",
    icon: "i-ph-moon",
    title: "Dark mode & Theme builder",
    desc: "Full dark mode support across all components, plus a new visual theme builder to create and preview custom color palettes without leaving the browser.",
  },
  {
    version: "v3.1",
    date: "Mar 2025",
    icon: "i-ph-plugs-connected",
    title: "500+ Data source connectors",
    desc: "Connect to any tool in your stack with pre-built connectors for databases, cloud storage, REST APIs, and streaming platforms. No configuration required.",
  },
  {
    version: "v3.0",
    date: "Jan 2025",
    icon: "i-ph-robot",
    title: "AI-assisted layout generation",
    desc: "Describe what you need in plain language and let the AI assistant generate dashboard layouts, suggest relevant KPIs, and pre-fill sample data for rapid prototyping.",
  },
  {
    version: "v2.9",
    date: "Oct 2024",
    icon: "i-ph-users-three",
    title: "Real-time collaboration",
    desc: "Multiple users can now edit dashboards simultaneously. Live cursors, presence indicators, and conflict-free merging keep everyone in sync.",
  },
];

export default function ReleaseNotes() {
  const [read, setRead] = useState(new Set([0]));
  const unread = RELEASES.length - read.size;

  return (
    <HvCarousel
      title="What's new"
      showSlideControls
      showDots
      carouselOptions={{ loop: false }}
      onChange={(i) => setRead((prev) => new Set([...prev, i]))}
      classes={{
        slidesViewport: "pt-sm",
        main: "px-xl",
        slideControls: "!opacity-100",
      }}
      actions={
        <div className="flex items-center gap-xs">
          {unread > 0 ? (
            <>
              <HvTypography variant="caption2">{unread} unread</HvTypography>
              <HvButton
                variant="secondaryGhost"
                size="sm"
                onClick={() => setRead(new Set(RELEASES.map((_, i) => i)))}
              >
                Mark all as read
              </HvButton>
            </>
          ) : (
            <div className="flex gap-xxs mr-sm items-center">
              <HvTypography variant="caption2" className="text-positive">
                All caught up
              </HvTypography>
              <HvIconContainer size="xs">
                <div className="i-ph-check-circle text-positive" />
              </HvIconContainer>
            </div>
          )}
        </div>
      }
    >
      {RELEASES.map((r, i) => (
        <HvCarouselSlide key={r.version}>
          <HvCard bgcolor="bgContainer" className="h-full mx-sm">
            <HvCardHeader
              title={
                <div className="flex items-center gap-xs">
                  <HvIconContainer>
                    <div className={`${r.icon}`} />
                  </HvIconContainer>
                  <HvTypography variant="title4">{r.title}</HvTypography>
                </div>
              }
              subheader={
                <div className="flex items-center gap-xs">
                  <HvTag label={r.version} color="info" />
                  <HvTypography variant="caption2">{r.date}</HvTypography>
                  {!read.has(i) && (
                    <span className="size-6px rounded-full bg-brand" />
                  )}
                </div>
              }
            />
            <HvCardContent>
              <HvTypography className="text-secondary">{r.desc}</HvTypography>
            </HvCardContent>
          </HvCard>
        </HvCarouselSlide>
      ))}
    </HvCarousel>
  );
}
