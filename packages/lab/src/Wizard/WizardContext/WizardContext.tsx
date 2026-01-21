import { createContext, Dispatch, SetStateAction } from "react";

export type HvWizardTab = {
  name?: string;
  valid?: boolean | null;
  mustValidate?: boolean;
  touched?: boolean;
  form?: any;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  [other: string]: any;
};

export type HvWizardTabs = Partial<Record<number, HvWizardTab>>;

type HvWizardContextProp = {
  context: HvWizardTabs;
  setContext: React.Dispatch<React.SetStateAction<HvWizardTabs>>;
  summary: boolean;
  setSummary: React.Dispatch<React.SetStateAction<boolean>>;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
};

const HvWizardContext = createContext<HvWizardContextProp>({
  context: {},
  setContext: () => {},
  summary: false,
  setSummary: () => {},
  tab: 0,
  setTab: () => {},
});

export default HvWizardContext;
