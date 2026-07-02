import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCarousel,
  HvCarouselSlide,
  HvStatusIcon,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

type SlideVariant = "success" | "warning" | "info" | "default";

const SLIDES: {
  icon: string;
  variant: SlideVariant;
  title: string;
  desc: string;
}[] = [
  {
    icon: "i-ph-chart-line",
    variant: "success",
    title: "Real-time Analytics",
    desc: "Monitor KPIs with live dashboards updated every second.",
  },
  {
    icon: "i-ph-shield-check",
    variant: "warning",
    title: "Enterprise Security",
    desc: "End-to-end encryption with role-based access control.",
  },
  {
    icon: "i-ph-plugs-connected",
    variant: "info",
    title: "500+ Integrations",
    desc: "Connect any tool in your stack with pre-built connectors.",
  },
  {
    icon: "i-ph-cloud",
    variant: "default",
    title: "Cloud Native",
    desc: "Deploy anywhere with auto-scaling and zero-downtime updates.",
  },
];

export default function Spotlight() {
  return (
    <HvCarousel
      showSlideControls
      showDots
      controlsPosition="bottom"
      carouselOptions={{ loop: true }}
      className="w-[600px]"
      classes={{
        root: "bg-transparent",
        main: "px-xl py-xs",
        slideControls: "!opacity-100",
        slidesViewport: "pb-xs",
        dot: "h-4px w-4px rounded-full",
        dotSelected: "!w-[20px] !h-[8px]",
        controls: "border-none",
      }}
    >
      {SLIDES.map((slide) => (
        <HvCarouselSlide key={slide.title}>
          <div className="h-full mx-sm">
            <HvCard bgcolor="bgContainer" className="h-full">
              <HvCardHeader
                title={
                  <div className="flex items-center gap-xs">
                    <HvStatusIcon
                      variant={slide.variant}
                      customIcon={
                        slide.variant === "default" ? (
                          <div className={slide.icon} />
                        ) : undefined
                      }
                    />
                    <HvTypography variant="title4">{slide.title}</HvTypography>
                  </div>
                }
              />
              <HvCardContent>
                <HvTypography>{slide.desc}</HvTypography>
              </HvCardContent>
            </HvCard>
          </div>
        </HvCarouselSlide>
      ))}
    </HvCarousel>
  );
}
