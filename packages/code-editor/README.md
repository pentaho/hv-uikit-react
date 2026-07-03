# @hitachivantara/uikit-react-code-editor

React Monaco editor wrapper with our Design System styles.

## Installation

```sh
npm install @hitachivantara/uikit-react-code-editor
```

## Usage

```jsx
import { HvCodeEditor } from "@hitachivantara/uikit-react-code-editor";

<HvCodeEditor
  language="javascript"
  defaultValue="console.log('Hello, World!');"
/>;
```

## Offline Support

The editor automatically handles offline support:

- **Vite**: Workers are bundled by default
- **Other bundlers**: Falls back to CDN

### Vite Configuration

To prevent Vite from pre-bundling Monaco Editor, add the following to your `vite.config.js`:

```js
export default {
  optimizeDeps: {
    exclude: ["monaco-editor"],
  },
};
```

## Documentation

See [Monaco Editor for React](https://github.com/suren-atoyan/monaco-react) for additional options.
