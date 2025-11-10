import { HvLoading } from "@hitachivantara/uikit-react-core";

export interface LoadingProps {
  label?: string;
}

/** _Fullscreen_ `HvLoading` component to use with `Suspense` and other loading fallbacks */
export const Loading: React.FC<LoadingProps> = ({ label }) => (
  <HvLoading
    role="progressbar"
    label={label}
    aria-valuetext={label}
    className="size-full z-overlay"
  />
);
