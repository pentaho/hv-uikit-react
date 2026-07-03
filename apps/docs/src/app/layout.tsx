import "nextra-theme-docs/style.css";
import "./globals.css";

import type { NextraMetadata } from "nextra";
import { Layout, Navbar, ThemeSwitch } from "nextra-theme-docs";
import { Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";

import { UIKitLogo } from "../assets/logos";
import { Footer } from "../components/Footer";
import { Main } from "../components/Main";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

const title = "UI Kit";
const description = "UI Kit documentation site";

export const metadata = {
  metadataBase: new URL("https://github.com/pentaho/hv-uikit-react"),
  title: { default: "UI Kit", template: "%s - UI Kit" },
  description,
  icons: "https://pentaho.github.io/assets/uikit-icon.svg",
  creator: "UI Kit Team",
  applicationName: title,
  appleWebApp: { title },
  openGraph: {
    url: "/",
    siteName: title,
    title,
    description,
    type: "website",
  },
} satisfies NextraMetadata;

const navbar = (
  <Navbar
    logo={<UIKitLogo />}
    projectLink="https://github.com/pentaho/hv-uikit-react"
  >
    <ThemeSwitch lite />
    <ThemeSwitcher />
  </Navbar>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" color={{ hue: 210 }}>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          feedback={{ content: null }}
          toc={{ title: "Table of Contents" }}
          search={<Search placeholder="Search..." />}
          footer={<Footer />}
          editLink={null}
          docsRepositoryBase="https://github.com/pentaho/hv-uikit-react/tree/master/apps/docs"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: false }}
          pageMap={await getPageMap()}
        >
          <Main>{children}</Main>
        </Layout>
      </body>
    </html>
  );
}
