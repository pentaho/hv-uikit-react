# My plugin

My plugin, a Pentaho plugin.

React and HV UI Kit 7 in the App Shell. The menu entry and views are in [plugin.json](plugin.json); each view's page is `src/pages/<view id>.tsx`, inside `src/components/ViewLayout.tsx`. To add a view, add it to `plugin.json` and add its page.

```bash
npm install
npm run dev       # the plugin in a local App Shell, its server calls answered from samples.json
npm run check     # format, types and lint, with the UI Kit design rules
npm test          # unit tests
npm run package   # built, checked and zipped: my-plugin.zip, to unzip into a server's pentaho-solutions/system
```

The server needs the App Shell and UI Kit versions the plugin is built with.

`samples.json` holds a response per server call (`"METHOD /path"`, `{param}` matching any value); open the page with `?samples=empty` (or run `SAMPLES=empty npm run dev`) to read `samples.empty.json` over it. The [Pentaho plugins guide](https://pentaho.github.io/uikit-docs/master/app-shell/pentaho-plugins#samples) covers the rest.

For coding agents: `npx --no-install uikit-tools init` points them at the UI Kit's design rules and lookups.
