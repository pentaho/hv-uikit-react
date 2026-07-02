import { useRef, useState } from "react";
import {
  HvCodeEditor,
  hvSqlFormatter,
} from "@hitachivantara/uikit-react-code-editor";
import {
  HvButton,
  HvPanel,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

// DDL schema – drives table/column autocomplete and SQL validation
const schema = `
CREATE TABLE assets (
  id         INT PRIMARY KEY,
  name       VARCHAR(255),
  type       VARCHAR(100),
  site_id    INT,
  status     VARCHAR(50),
  uptime     FLOAT
);

CREATE TABLE sites (
  id         INT PRIMARY KEY,
  name       VARCHAR(255),
  region     VARCHAR(50),
  country    VARCHAR(100)
);

CREATE TABLE events (
  id          INT PRIMARY KEY,
  asset_id    INT,
  severity    VARCHAR(50),
  description TEXT,
  created_at  DATETIME
);

CREATE TABLE maintenance (
  id             INT PRIMARY KEY,
  asset_id       INT,
  scheduled_at   DATETIME,
  completed_at   DATETIME,
  technician     VARCHAR(255)
);
`;

const defaultQuery = `SELECT
  a.name,
  a.type,
  a.status,
  s.name AS site,
  s.region,
  COUNT(e.id) AS total_events
FROM assets a
JOIN sites s ON a.site_id = s.id
LEFT JOIN events e ON e.asset_id = a.id
WHERE a.status != 'offline'
GROUP BY a.id, s.id
ORDER BY total_events DESC;`;

export default function Demo() {
  const editorRef = useRef<any>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<string | null>(null);

  const handleFormat = async () => {
    const formatted = await hvSqlFormatter(query);
    if (formatted) setQuery(formatted);
  };

  const handleRun = () => {
    // Simulated result — in a real app this would call an API
    setResult(
      `Returned 4 rows in 12ms\n\n` +
        `name            | type       | status | site           | region | total_events\n` +
        `----------------|------------|--------|----------------|--------|--------------\n` +
        `Compressor A    | Rotary     | Active | Lisbon Plant   | EMEA   | 14\n` +
        `Turbine 2       | Gas        | Active | Berlin Site    | EMEA   | 9\n` +
        `Drill Unit 01   | Hydraulic  | Active | Houston Fac.   | AMER   | 7\n` +
        `Chiller A       | Centrifug. | Active | Singapore Hub  | APAC   | 3`,
    );
  };

  return (
    <div className="flex flex-col gap-xs w-full">
      {/* Toolbar */}
      <HvPanel className="flex items-center gap-xs border-b-none!">
        <HvTypography variant="label">query.sql</HvTypography>
        <div className="flex-1" />
        <HvButton size="xs" variant="secondarySubtle" onClick={handleFormat}>
          Format
        </HvButton>
        <HvButton size="xs" onClick={handleRun}>
          Run
        </HvButton>
      </HvPanel>

      {/* Editor */}
      <HvCodeEditor
        height={240}
        language="sql"
        schema={schema}
        value={query}
        onChange={(val) => setQuery(val ?? "")}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />

      {/* Result pane */}
      {result && (
        <HvPanel className="border-t-none!">
          <HvTypography
            variant="caption1"
            component="pre"
            className="font-mono whitespace-pre overflow-auto color-textSubtle"
          >
            {result}
          </HvTypography>
        </HvPanel>
      )}
    </div>
  );
}
