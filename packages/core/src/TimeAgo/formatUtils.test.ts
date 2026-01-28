import { describe, expect, it } from "vitest";

import { formatTimeAgo } from "./formatUtils";

describe("formatTimeAgo", () => {
  const referenceDate = new Date("2026-01-15T12:00:00.000Z");

  describe("Past dates", () => {
    it("should show 'now' for timestamps less than 20 seconds ago", () => {
      const timestamp = new Date(referenceDate.getTime() - 10 * 1000).getTime();
      const result = formatTimeAgo(timestamp, "en", false, referenceDate);
      expect(result).toBe("now");
    });

    it("should show seconds ago for timestamps less than 2 minutes ago", () => {
      const timestamp = new Date(referenceDate.getTime() - 90 * 1000).getTime();
      const result = formatTimeAgo(timestamp, "en", false, referenceDate);
      expect(result).toBe("90 seconds ago");
    });

    it("should show minutes ago for timestamps 2-60 minutes ago", () => {
      const timestamp = new Date(
        referenceDate.getTime() - 30 * 60 * 1000,
      ).getTime();
      const result = formatTimeAgo(timestamp, "en", false, referenceDate);
      expect(result).toBe("30 minutes ago");
    });

    it("should show 'today' for timestamps earlier today", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setHours(8, 0, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("today, 8:00 AM");
    });

    it("should show yesterday for timestamps from yesterday", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setDate(timestamp.getDate() - 1);
      timestamp.setHours(14, 30, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("yesterday, 2:30 PM");
    });

    it("should show weekday for timestamps within the past week", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setDate(timestamp.getDate() - 2);
      timestamp.setHours(10, 0, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("Tue 10:00 AM");
    });

    it("should show full date for timestamps older than a week", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setDate(timestamp.getDate() - 10);
      timestamp.setHours(10, 0, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("Jan 5, 2026, 10:00 AM");
    });
  });

  describe("Future dates", () => {
    it("should show full date for dates 2+ days ahead", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setDate(timestamp.getDate() + 3);
      timestamp.setHours(15, 0, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("Jan 18, 2026, 3:00 PM");
    });

    it("should show 'tomorrow' for dates tomorrow", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setDate(timestamp.getDate() + 1);
      timestamp.setHours(15, 0, 0, 0);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("tomorrow, 3:00 PM");
    });

    it("should show 'today' for future dates today more than 1 hour ahead", () => {
      const timestamp = new Date(referenceDate);
      timestamp.setHours(referenceDate.getHours() + 2);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("today, 2:00 PM");
    });

    it("should show minutes for future dates 2-60 minutes ahead", () => {
      const timestamp = new Date(referenceDate.getTime() + 30 * 60 * 1000);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("in 30 minutes");
    });

    it("should show seconds for future dates less than 2 minutes ahead", () => {
      const timestamp = new Date(referenceDate.getTime() + 90 * 1000);
      const result = formatTimeAgo(
        timestamp.getTime(),
        "en",
        false,
        referenceDate,
      );
      expect(result).toBe("in 90 seconds");
    });
  });
});
