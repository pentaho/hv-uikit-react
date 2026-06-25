import { useCallback, useRef, useState } from "react";
import {
  HvButton,
  HvCheckBox,
  HvPanel,
  HvSection,
  HvStatusIcon,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { HvStepNavigation } from "@hitachivantara/uikit-react-lab";

const STAGES = [
  {
    label: "Fetch",
    detail: "Fetching 3,847 records from source API",
    duration: 1200,
  },
  { label: "Parse", detail: "Parsing raw JSON payload", duration: 900 },
  { label: "Validate", detail: "Running 12 integrity checks", duration: 1500 },
  {
    label: "Transform",
    detail: "Applying field mappings and enrichment",
    duration: 1000,
  },
  { label: "Load", detail: "Writing to asset database", duration: 800 },
];

type StageState = "Pending" | "Current" | "Completed" | "Failed";
type JobStatus = "idle" | "running" | "completed" | "failed";

interface LogEntry {
  id: number;
  ts: string;
  text: string;
  level: "info" | "success" | "error";
}

const timestamp = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false });

const JOB_COLORS: Record<JobStatus, string> = {
  idle: "atmo",
  running: "primary",
  completed: "positive",
  failed: "negative",
};

const JOB_LABELS: Record<JobStatus, string> = {
  idle: "Idle",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

export default function Demo() {
  const [jobStatus, setJobStatus] = useState<JobStatus>("idle");
  const [stageStates, setStageStates] = useState<StageState[]>(
    STAGES.map(() => "Pending"),
  );
  const [log, setLog] = useState<LogEntry[]>([]);
  const [injectError, setInjectError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  const appendLog = useCallback((text: string, level: LogEntry["level"]) => {
    setLog((prev) => {
      const next = [
        ...prev,
        { id: logIdRef.current++, ts: timestamp(), text, level },
      ];
      // scroll to bottom on next paint
      requestAnimationFrame(() =>
        logEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
      return next;
    });
  }, []);

  // Use a ref so the recursive closure always sees the latest version
  const runStageRef = useRef<(index: number, shouldFail: boolean) => void>(
    null!,
  );
  runStageRef.current = (index: number, shouldFail: boolean) => {
    setStageStates((prev) => prev.map((s, i) => (i === index ? "Current" : s)));
    appendLog(`[${STAGES[index].label}] ${STAGES[index].detail}…`, "info");

    timerRef.current = setTimeout(() => {
      // Inject failure on Validate step
      if (shouldFail && index === 2) {
        setStageStates((prev) => prev.map((s, i) => (i === 2 ? "Failed" : s)));
        appendLog(
          `[Validate] Checksum mismatch detected on field "sensor_id" — aborting.`,
          "error",
        );
        setJobStatus("failed");
        return;
      }

      setStageStates((prev) =>
        prev.map((s, i) => (i === index ? "Completed" : s)),
      );
      appendLog(`[${STAGES[index].label}] Done.`, "success");

      if (index < STAGES.length - 1) {
        runStageRef.current(index + 1, shouldFail);
      } else {
        setJobStatus("completed");
        appendLog(
          "Job completed successfully — 3,847 records loaded.",
          "success",
        );
      }
    }, STAGES[index].duration);
  };

  const handleRun = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStageStates(STAGES.map(() => "Pending"));
    setLog([]);
    setJobStatus("running");
    appendLog("Job started.", "info");
    runStageRef.current(0, injectError);
  };

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setJobStatus("idle");
    setStageStates(STAGES.map(() => "Pending"));
    appendLog("Job cancelled.", "error");
  };

  const steps = STAGES.map((stage, i) => ({
    title: stage.label,
    state: stageStates[i],
    // Highlight completed separators in green
    separatorClassName:
      stageStates[i] === "Completed" ? "bg-positive h-3px!" : undefined,
  }));

  return (
    <HvSection
      title={
        <div className="flex items-center gap-xs">
          <HvTypography variant="title4">Data Import Job</HvTypography>
          <HvTag label={JOB_LABELS[jobStatus]} color={JOB_COLORS[jobStatus]} />
        </div>
      }
      actions={
        <div className="flex items-center gap-sm">
          <HvCheckBox
            label="Inject error"
            checked={injectError}
            onChange={(_, v) => setInjectError(v)}
            disabled={jobStatus === "running"}
          />
          {jobStatus === "running" ? (
            <HvButton size="sm" variant="secondarySubtle" onClick={handleStop}>
              Stop
            </HvButton>
          ) : (
            <HvButton size="sm" onClick={handleRun}>
              Run job
            </HvButton>
          )}
        </div>
      }
      classes={{ content: "flex flex-col gap-sm" }}
    >
      <HvStepNavigation steps={steps} />

      {/* Log panel */}
      <HvPanel className="h-160px overflow-y-auto flex flex-col gap-2px font-mono">
        {log.length === 0 ? (
          <HvTypography
            variant="caption1"
            className="color-textDisabled m-auto"
          >
            No output yet — press Run job to start.
          </HvTypography>
        ) : (
          log.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-xs items-center leading-snug"
            >
              <HvTypography
                variant="caption1"
                component="span"
                className="color-textDisabled shrink-0 tabular-nums"
              >
                {entry.ts}
              </HvTypography>
              <HvStatusIcon
                type="simple"
                variant={
                  entry.level === "success"
                    ? "success"
                    : entry.level === "error"
                      ? "error"
                      : "info"
                }
                className="mt-2px shrink-0"
              />
              <HvTypography
                variant="caption1"
                component="span"
                className={
                  entry.level === "error"
                    ? "color-negative"
                    : entry.level === "success"
                      ? "color-positive"
                      : "color-textSubtle"
                }
              >
                {entry.text}
              </HvTypography>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </HvPanel>
    </HvSection>
  );
}
