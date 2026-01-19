// oxlint-disable complexity
"use client";

import { Children, isValidElement, useCallback, useState } from "react";
import { CodeEditor } from "react-live-runner";

import { ComponentMeta } from "../../utils/component";
import { Controls, type Control } from "./Controls";
import { DocsProvider } from "./DocsProvider";

export interface PlaygroundProps {
  Component: React.ComponentType<{ children?: React.ReactNode }>;
  componentName: string;
  componentProps?: Record<string, unknown>;
  meta?: ComponentMeta;
  controls: Record<string, Control>;
  children?: React.ReactNode;
  decoratorClassName?: string;
}

// Simple JSX serializer that builds string from props without relying on component names
const elementToJSX = (element: React.ReactElement): string => {
  const type = element.type as any;

  // Try to get a reasonable component name
  let name = "UnknownComponent";

  // Check for lazy components
  if (type?._payload?.value) {
    const resolved = type._payload.value;

    // Handle React Server Components format: [path, exports, name]
    if (Array.isArray(resolved) && resolved.length >= 3) {
      name = resolved[2] || "Component";
    } else if (resolved.$$typeof?.toString() === "Symbol(react.forward_ref)") {
      name =
        resolved.render?.name ||
        resolved.render?.displayName ||
        resolved.displayName ||
        "Component";
    } else {
      name = resolved.displayName || resolved.name || "Component";
    }
  } else if (type?.$$typeof?.toString() === "Symbol(react.forward_ref)") {
    name = type.render?.name || type.displayName || "Component";
  } else if (typeof type === "string") {
    name = type;
  } else {
    name = type?.displayName || type?.name || "Component";
  }

  // Build props string
  const props = Object.keys(element.props)
    .filter((key) => key !== "children")
    .map((key) => {
      const value = element.props[key];
      if (value === true) return key;
      if (typeof value === "string") return `${key}="${value}"`;
      if (typeof value === "number") return `${key}={${value}}`;
      // Handle React element props recursively
      if (isValidElement(value)) {
        try {
          return `${key}={${elementToJSX(value)}}`;
        } catch (e) {
          console.error("Failed to serialize element in prop:", key, e);
          return null;
        }
      }
      // Skip other objects to avoid serialization issues
      if (typeof value === "object" && value !== null) {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return null;
    })
    .filter(Boolean)
    .join(" ");

  const propsStr = props ? ` ${props}` : "";

  // Handle children
  const { children } = element.props;
  if (!children) {
    return `<${name}${propsStr} />`;
  }

  if (typeof children === "string") {
    return `<${name}${propsStr}>${children}</${name}>`;
  }

  // Handle React element children recursively
  if (isValidElement(children)) {
    const childCode = elementToJSX(children);
    return `<${name}${propsStr}>\n  ${childCode}\n</${name}>`;
  }

  // Handle array of children
  if (Array.isArray(children)) {
    const childrenCode = children
      .map((child) => {
        if (typeof child === "string") return child;
        if (isValidElement(child)) return elementToJSX(child);
        return "";
      })
      .filter(Boolean)
      .join("\n  ");

    if (childrenCode) {
      return `<${name}${propsStr}>\n  ${childrenCode}\n</${name}>`;
    }
  }

  return `<${name}${propsStr} />`;
};

const parseChildren = (child: React.ReactNode): string => {
  if (typeof child === "string") return child;
  if (!isValidElement(child)) return "";

  try {
    return elementToJSX(child);
  } catch (e) {
    console.error("Failed to parse child:", e);
    return "";
  }
};

const generateCode = (
  componentName: string,
  componentProps: Record<string, unknown> = {},
  children?: React.ReactNode | React.ReactNode[],
): string => {
  // Format props and componentProps into strings
  const parsedPropsString = Object.entries(componentProps)
    .filter(([key]) => key !== "style")
    .map(([key, value]) => {
      if (typeof value === "string") return `${key}="${value}"`;
      if (isValidElement(value)) {
        try {
          const elementString = elementToJSX(value);
          return `${key}={${elementString}}`;
        } catch (e) {
          console.error("Failed to serialize element prop:", key, e);
          return null;
        }
      }
      if (typeof value === "object") return `${key}={${JSON.stringify(value)}}`;
      if (typeof value === "boolean") return value ? key : `${key}={false}`;
      return `${key}={${value}}`;
    })
    .filter(Boolean)
    .map((str) => `  ${str}\n`)
    .join("");
  const componentPropsString = parsedPropsString && `\n${parsedPropsString}`;

  // Handle children content
  const childrenString = Children.toArray(children)
    .map(parseChildren)
    .filter(Boolean)
    .join("\n");

  // Generate and return the final code
  if (childrenString) {
    return `<${componentName} ${componentPropsString}>
  ${String(childrenString).replaceAll("\n", "\n  ")}
</${componentName}>`;
  }

  return `<${componentName} ${componentPropsString}/>`.trim();
};

export const Playground = ({
  Component,
  componentName,
  meta,
  componentProps,
  controls = {},
  children,
  decoratorClassName,
}: PlaygroundProps) => {
  // Initialize dynamic props with default values from controls
  const [dynamicProps, setDynamicProps] = useState<Record<string, unknown>>(
    () =>
      Object.entries(controls).reduce<
        Record<string, string | number | boolean>
      >((acc, [key, control]) => {
        acc[key] = control.defaultValue ?? "";
        return acc;
      }, {}),
  );

  // Update dynamic prop values
  const updatePropValue = useCallback((prop: string, value: unknown) => {
    setDynamicProps((prevProps) => ({
      ...prevProps,
      [prop]: value,
    }));
  }, []);

  // Return null if no Component is provided
  if (!Component) return null;

  // Generate the code representation for the component
  const code = generateCode(
    componentName,
    { ...dynamicProps, ...componentProps },
    children,
  );

  const componentElement = (
    <Component {...componentProps} {...dynamicProps}>
      {children}
    </Component>
  );

  return (
    <section
      data-pagefind-ignore
      className="[&>*]:border-border"
      aria-label="Playground"
    >
      {/* Component preview and controls */}
      <DocsProvider className="grid grid-cols-[2fr_1fr] border rounded-t-round">
        {/* Preview Area */}
        <div className="grid place-items-center rounded-inherit p-sm h-full">
          {decoratorClassName ? (
            <div className={decoratorClassName}>{componentElement}</div>
          ) : (
            componentElement
          )}
        </div>

        {/* Controls Area */}
        <div className="rounded-inherit border-l border-color-inherit h-full">
          <div className="flex flex-col gap-xs py-sm px-xs">
            {Object.entries(controls).map(([prop, control]) => {
              if (!control) return null;

              return (
                <Controls
                  key={prop}
                  prop={prop}
                  meta={meta}
                  state={dynamicProps}
                  control={control}
                  onChange={updatePropValue}
                />
              );
            })}
          </div>
        </div>
      </DocsProvider>

      {/* Code editor */}
      <div className="max-h-100 overflow-auto rounded-b-round border border-t-0 max-h-250px">
        <CodeEditor readOnly className="font-mono text-[.85em]" value={code} />
      </div>
    </section>
  );
};
