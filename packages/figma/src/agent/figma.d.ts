// The agent's core runs in Figma's sandbox. Its API's types come from Figma's typings; their globals are declared here
// rather than with the typings' index, which also redeclares the DOM's console and fetch for the whole repository.
import "@figma/plugin-typings/plugin-api";

declare global {
  const figma: PluginAPI;
}
