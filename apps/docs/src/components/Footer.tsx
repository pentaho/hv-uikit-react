import Link from "next/link";

import { UIKitLogo } from "../assets/logos";

const footerLinks = [
  {
    title: "Project",
    links: [
      { label: "Get Started", href: "/docs/get-started" },
      { label: "Project Status", href: "/docs/project-status" },
      { label: "Community", href: "/docs/community" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/components" },
      { label: "Charts", href: "/charts" },
      { label: "Examples", href: "/examples" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Team",
        href: "https://github.com/pentaho/hv-uikit-react?tab=readme-ov-file#team-",
      },
      {
        label: "Slack",
        href: "https://hitachivantara-eng.slack.com/archives/CFY74GK6G",
      },
      {
        label: "GitHub",
        href: "https://github.com/pentaho/hv-uikit-react",
      },
      {
        label: "License",
        href: "https://github.com/pentaho/hv-uikit-react/?tab=Apache-2.0-1-ov-file#readme",
      },
    ],
  },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-lg border-t border-borderSubtle">
      <div className="max-w-1400px mx-auto px-md">
        <div className="flex flex-col md:flex-row md:justify-between space-y-md md:space-y-0">
          {/* Logo Section with More Space */}
          <div className="flex flex-col">
            <Link
              aria-label="UIKit"
              href="/"
              className="flex items-center space-x-sm"
            >
              <UIKitLogo />
            </Link>
            <p className="text-sm mt-sm">by Pentaho © {year}</p>
          </div>

          {/* Link Groups Right-Aligned */}
          <div className="grid grid-cols-3 text-md gap-lg md:gap-xl">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-xs">
                <p className="font-semibold text-primary">{group.title}</p>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-primary"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
