import { useQueryBuilderContext } from "../Context";
import {
  defaultRendererKey,
  type HvQueryBuilderRendererProps,
  type ValueRenderer,
} from "../types";
import { BooleanValue } from "./BooleanValue";
import { DateTimeValue } from "./DateTimeValue";
import { EmptyValue } from "./EmptyValue";
import { NumericValue } from "./NumericValue";
import { TextValue } from "./TextValue";

export interface ValueProps {
  id: React.Key;
  attribute: string;
  operator?: string;
  value?: any;
}

const getRenderer = (renderer: ValueRenderer, operator?: string) =>
  // 1. Custom renderer
  (typeof renderer === "function" && renderer) ||
  // 2. Custom operator renderer
  (typeof renderer === "object" && operator && renderer[operator]) ||
  // 3. Custom DEFAULT renderer
  (typeof renderer === "object" && renderer[defaultRendererKey]);

export const Value = ({
  id,
  attribute,
  operator,
  value: valueProp,
}: ValueProps) => {
  const { attributes, initialTouched, renderers, emptyRenderer } =
    useQueryBuilderContext();

  const attrType = attributes?.[attribute]?.type;

  // Empty value renderer
  if (emptyRenderer?.find((op) => op === operator)) {
    return <EmptyValue id={id} />;
  }

  // Custom renderer
  if (attrType && renderers?.[attrType]) {
    // Renderer to be used by order:
    // 1. Custom attribute renderer
    // 2. Custom attribute-operator renderer
    // 3. Custom attribute-DEFAULT renderer
    // 4. Custom master DEFAULT renderer
    // 5. Custom master DEFAULT-operator renderer
    // 6. Custom master DEFAULT-DEFAULT renderer
    const Renderer: React.FC<HvQueryBuilderRendererProps> | undefined =
      getRenderer(renderers[attrType], operator) ||
      getRenderer(renderers[defaultRendererKey], operator) ||
      undefined;

    if (Renderer) {
      return (
        <Renderer
          id={id}
          attribute={attribute}
          operator={operator}
          value={valueProp}
        />
      );
    }
  }

  // Built-in attributes
  switch (attrType) {
    case "boolean": {
      return <BooleanValue id={id} value={!!valueProp} />;
    }
    case "numeric": {
      return (
        <NumericValue
          id={id}
          operator={operator}
          value={valueProp}
          initialTouched={initialTouched}
        />
      );
    }
    case "dateandtime": {
      return (
        <DateTimeValue
          id={id}
          operator={operator}
          value={valueProp}
          initialTouched={initialTouched}
        />
      );
    }
    case "text":
    case "textarea":
    default:
      return (
        <TextValue id={id} value={valueProp} initialTouched={initialTouched} />
      );
  }
};
