import { useState } from "react";
import {
  HvBaseDropdownPopper,
  HvButton,
  HvIconContainer,
  HvInput,
  HvListItem,
  HvMultiButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS } from "@hitachivantara/uikit-react-icons";

export default function LoginShort() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
  };

  return (
    <LoginContainer
      title={
        <>
          <span className="text-32px">Welcome to</span>
          <br />
          <strong className="text-64px">Pentaho</strong>
        </>
      }
      subtitle="Pentaho User Console"
    >
      <form
        autoComplete="on"
        className="flex flex-col justify-center gap-sm mx-auto max-w-lg min-h-500px"
        onSubmit={handleSubmit}
      >
        <HvTypography variant="title4" component="h3">
          Log in to your account:
        </HvTypography>
        <div className="grid gap-md">
          <div className="grid gap-xs">
            <HvInput
              required
              name="username"
              label="Username"
              placeholder="Your username..."
            />
            <HvInput
              required
              name="password"
              type="password"
              label="Password"
              placeholder="Your password..."
              minCharQuantity={8}
              maxCharQuantity={48}
              validation={(value) => /[^a-zA-Z0-9]/.test(value)}
              validationMessages={{
                requiredError: "Password is required",
                minCharError: "Password must be at least 8 characters",
                maxCharError: "Password must be at most 48 characters",
                error: "Password must include a special character",
              }}
            />
            <HvTypography variant="caption1" className="text-textSubtle">
              Forgot password?{" "}
              <HvTypography link component="a" variant="caption1">
                Recover now
              </HvTypography>
              .
            </HvTypography>
          </div>
          <div className="grid gap-sm">
            <LoginMultiButton />
            <Hr>or</Hr>
            <HvButton startIcon={<MsLogo />} variant="secondarySubtle">
              Sign in with Microsoft
            </HvButton>
            <HvButton startIcon={<GoogleLogo />} variant="secondarySubtle">
              Sign in with Google
            </HvButton>
          </div>
        </div>
        <HvButton
          variant="secondaryGhost"
          className="mt-sm"
          startIcon={
            <HvIconContainer size="sm">
              <div className="i-ph-key" />
            </HvIconContainer>
          }
        >
          Request access
        </HvButton>
      </form>
    </LoginContainer>
  );
}

function LoginMultiButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  return (
    <>
      <HvMultiButton split variant="primary" className="w-auto">
        <HvButton type="submit" className="w-full">
          Log In
        </HvButton>
        <HvButton icon onClick={(evt) => setAnchorEl(evt.currentTarget)}>
          <DropDownXS />
        </HvButton>
      </HvMultiButton>
      <HvBaseDropdownPopper
        disablePortal
        anchorEl={anchorEl}
        open={open}
        placement="bottom-end"
        className="z-popover"
        onClickAway={() => setAnchorEl(undefined)}
        classes={{ panel: "grid gap-sm p-sm" }}
      >
        <ListItem name="Administrator" iconId="i-ph-user-gear" />
        <ListItem name="Business User" iconId="i-ph-user" />
      </HvBaseDropdownPopper>
    </>
  );
}

const ListItem = ({ name, iconId }: { name: string; iconId: string }) => (
  <HvListItem
    selectable
    tabIndex={0}
    startAdornment={
      <HvIconContainer size="sm" className="size-32px">
        <div className={iconId} />
      </HvIconContainer>
    }
    endAdornment={
      <HvIconContainer size="sm" className="size-32px">
        <div className="i-ph-sign-in" />
      </HvIconContainer>
    }
  >
    <span>
      Log In as <strong>{name}</strong>
    </span>
  </HvListItem>
);

const Hr = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex my-xs items-center justify-center w-full">
    <hr className="w-full h-px bg-border border-0" />
    <span className="absolute px-xs font-medium bg-bgPage text-textSubtle">
      {children}
    </span>
  </div>
);

const LoginContainer = ({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className="flex flex-col gap-lg p-sm items-center bg-cover bg-center"
    style={{ backgroundImage: "url(https://i.imgur.com/EivMdmh.jpeg)" }}
  >
    <HvTypography variant="title2" className="text-textLight w-full">
      {subtitle}
    </HvTypography>
    <HvTypography variant="title1" className="text-textLight leading-[1]">
      {title}
    </HvTypography>
    <div className="w-sm shadow shadow-border py-md px-32px mb-lg bg-bgPage rounded-large">
      {children}
    </div>
  </div>
);

const MsLogo = () => (
  <svg viewBox="0 0 20 20" className="size-1em text-20px">
    <path fill="#F25022" d="M9.52.95H.95v8.57h8.57z" />
    <path fill="#00A4EF" d="M9.52 10.48H.95v8.57h8.57z" />
    <path fill="#7FBA00" d="M19.05.95h-8.57v8.57h8.57z" />
    <path fill="#FFB900" d="M19.05 10.48h-8.57v8.57h8.57z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 18 18" className="size-1em text-20px">
    <path
      fill="#4285F4"
      d="M17.64 9.2q0-.95-.16-1.84H9v3.48h4.84a4 4 0 0 1-1.8 2.72v2.26h2.92a8.8 8.8 0 0 0 2.68-6.62"
    />
    <path
      fill="#34A853"
      d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 9 18"
    />
    <path
      fill="#FBBC05"
      d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V4.96h-3a9 9 0 0 0 0 8.08z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .96 4.95l3 2.34A5.4 5.4 0 0 1 9 3.58"
    />
  </svg>
);
