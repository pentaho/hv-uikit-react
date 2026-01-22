const getOption = <T>(opts: T[], i: number) => opts[i % opts.length];

const makeEvent = (i: number) => ({
  id: `${i + 1}`,
  name: `Event ${i + 1}`,
  description: `Description for event ${i + 1}`,
  createdDate: new Date("2020-03-20").toISOString().slice(0, 10),
  eventType: "Anomaly detection",
  status: getOption(["Closed", "Open"] as const, i),
  riskScore: (i % 100) + 1,
  severity: getOption(["Critical", "Major", "Average", "Minor"] as const, i),
  priority: getOption(["High", "Medium", "Low"] as const, i),
});

export type AssetEvent = ReturnType<typeof makeEvent>;

export const makeData = (len = 10) => [...Array(len).keys()].map(makeEvent);

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "negative";
    case "medium":
      return "warning";
    case "low":
      return "positive";
    default:
      return "neutral";
  }
};
