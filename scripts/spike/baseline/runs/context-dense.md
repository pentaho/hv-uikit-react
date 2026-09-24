# HvInput
import { HvInput } from "@pentaho/uikit-react-core";
Lets users enter and edit a single line of text.
props: name:string, value:string | number | reado…, defaultValue:string | number | reado…, label:ReactNode, description:ReactNode, disabled:boolean, readOnly:boolean, required:boolean, status:enum, statusMessage:string, infoMessage:ReactNode, type:HTMLInputTypeAttribute, placeholder:string, labels:(Partial<{ clearButtonL…, validationMessages:Partial<{ error: string…, suggestionListCallback:((value: string) => HvI…, enablePortal:boolean, suggestOnFocus:boolean, validation:((value: string) => boo…, autoFocus:boolean, hideClear:boolean, hideRevealPassword:boolean, hideSearchButton:boolean, showValidationIcon:boolean, endAdornment:ReactNode, maxCharQuantity:number, minCharQuantity:number, classes:Partial<{ root: string;…, inputProps:InputHTMLAttributes<HTM…, inputRef:Ref<any>, multiline:boolean, resizable:boolean, invalid:boolean
do: Use `HvTextArea` when the expected input is more than one line.
changed v7: `disableClear`, `disableRevealPassword` and `disableSearchButton` were removed. -> use `hideClear`, `hideRevealPassword`, `hideSearchButton`

# HvSelect
import { HvSelect } from "@pentaho/uikit-react-core";
Chooses a value from a known list of options within a form.
props: name:string, required:boolean, disabled:boolean, multiple:boolean, open:boolean, defaultOpen:boolean, value:{} | OptionValue[] | nu…, defaultValue:{} | OptionValue[] | nu…, buttonRef:Ref<HTMLButtonElement>, options:HvSelectOption<OptionVa…, getSerializedValue:((value: HvSelectValue<…, classes:Partial<{ root: string;…, placeholder:ReactNode, autoComplete:string, renderValue:((option: HvSelectValue…, variableWidth:boolean, inputProps:InputHTMLAttributes<HTM…, enablePortal:boolean, label:ReactNode, readOnly:boolean, description:ReactNode, id:string, statusMessage:string, status:enum, variant:enum, size:enum
do: Use `HvDropDownMenu` when the trigger opens a list of actions rather than selecting a value.

# HvButton
import { HvButton } from "@pentaho/uikit-react-core";
Triggers an action or event in place.
props: variant:enum, icon:boolean, disabled:boolean, className:string, startIcon:ReactNode, endIcon:ReactNode, size:enum, radius:enum, classes:Partial<{ root: string;…, selected:boolean, focusableWhenDisabled:boolean
do: Use a link, not a button, to navigate to another page — middle-click and open-in-new-tab only work on links.
dont: Do not disable a button to communicate a validation error without saying why. A disabled button leaves the tab order and screen readers announce nothing.
a11y 2.1.1 Keyboard: A disabled button is removed from the tab order. Set `focusableWhenDisabled` when the reason it is disabled must stay discoverable by keyboard and screen reader.
a11y 4.1.2 Name, Role, Value: `icon` renders an icon-only button, which has no text to announce. It still needs an accessible name via `aria-label`.

# HvGrid
import { HvGrid } from "@pentaho/uikit-react-core";
Lays out content on the 12-column responsive grid. Wraps `@mui/material/Grid`.
props: direction:enum, justifyContent:ResponsiveStyleValue<re…, columns:"auto" | ResponsiveStyl…, container:boolean, columnSpacing:number | "auto" | "xs"…, rowSpacing:number | "auto" | "xs"…, size:ResponsiveStyleValue<Gr…, spacing:number | "auto" | "xs"…, wrap:enum, classes:Partial<{ root: string;…, justify:enum
do: Use `style` or `className` for one-off styling. `sx` is accepted by the type signature but is destructured and never forwarded, so it silently does nothing.
dont: Do not reach for the grid for a simple one-off arrangement — utility classes such as `grid grid-cols-2 md:grid-cols-4` are lighter.
changed v7: Wraps `@mui/material/Grid` instead of `GridLegacy`.
changed v7: `item` and the per-breakpoint props `xs`/`sm`/`md`/`lg`/`xl` were removed; sizing goes through `size`. -> <HvGrid item xs={12} sm={6} /> → <HvGrid size={{ xs: 12, sm: 6 }} />
changed v7: `zeroMinWidth` was removed. -> use style={{ minWidth: 0 }}

