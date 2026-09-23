/**
 * Test fixtures for validation - intentional violations
 * This file should have ~8 violations that the validator catches
 */

import React from "react";
import { HvAvatar, HvButton } from "@pentaho/uikit-react-core";

export function ViolationExamples() {
  return (
    <div>
      {/* Violation 1: Invalid variant */}
      <HvButton variant="custom">Invalid Variant</HvButton>

      {/* Violation 2: Raw color instead of token */}
      <HvButton style={{ color: "#FF0000" }}>Delete Me</HvButton>

      {/* Violation 3: Selected without aria-pressed */}
      <HvButton selected={true}>Toggle?</HvButton>

      {/* Violation 4: Icon-only without aria-label */}
      <HvButton>🔍</HvButton>

      {/* Violation 5: Avatar missing alt text */}
      <HvAvatar src="user.jpg" />

      {/* Violation 6: Avatar with invalid variant */}
      <HvAvatar variant="circular-mini">JD</HvAvatar>

      {/* Violation 7: Avatar with backgroundColor (implies AvatarGroup context) */}
      <HvAvatar src="logo.png" backgroundColor="#FFF" />

      {/* Violation 8: Avatar with both src and children initials */}
      <HvAvatar src="user.jpg">JD</HvAvatar>

      {/* Valid examples (no violations) */}
      <HvButton variant="contained">Save</HvButton>
      <HvButton variant="subtle">Cancel</HvButton>
      <HvButton
        variant="ghost"
        selected={true}
        aria-pressed={true}
        onClick={() => {}}
      >
        Toggle
      </HvButton>
      <HvButton aria-label="Search">🔍</HvButton>

      <HvAvatar src="user.jpg" alt="John Doe" />
      <HvAvatar variant="square" src="logo.png" alt="Company Logo" />
      <HvAvatar>JD</HvAvatar>
    </div>
  );
}
