import HvAppShell from "@hitachivantara/app-shell-ui";

export default function App() {
  return <HvAppShell configUrl={document.baseURI + "app-shell.config.json"} />;
}
