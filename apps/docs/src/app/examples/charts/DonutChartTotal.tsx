import { HvTypography } from "@hitachivantara/uikit-react-core";
import { Ticket } from "@hitachivantara/uikit-react-icons";
import { HvDonutChart } from "@hitachivantara/uikit-react-viz";

export default function Demo() {
  const data = {
    Country: ["Portugal", "Spain", "France", "Germany"],
    "Tickets Sold": [61829, 123948, 253792, 524638],
  };

  return (
    <div className="relative size-full flex justify-center">
      <HvDonutChart
        height={300}
        width={400}
        data={data}
        groupBy="Country"
        measure="Tickets Sold"
        legend={{
          position: {
            y: "bottom",
            x: "center",
          },
        }}
      />
      <div className="grid place-items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Ticket size="M" />
        <HvTypography variant="title3">
          {data["Tickets Sold"].reduce((acc, value) => acc + value, 0)}
        </HvTypography>
      </div>
    </div>
  );
}
