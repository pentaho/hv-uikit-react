import userEvent from "@testing-library/user-event";

import renderTestProvider from "../tests/testUtils";
import { useBannerContext } from "./BannerProvider";

const TestComponent = () => {
  const { show } = useBannerContext();

  return (
    <button
      type="button"
      onClick={() =>
        show({
          type: "banner",
          variant: "default",
          message: "Lorem Ipsum",
        })
      }
    >
      Add Banner
    </button>
  );
};

describe("BannerProvider", () => {
  it("should show and dismiss the banner correctly", async () => {
    const user = userEvent.setup();
    const { queryByText, getByText, getByRole } = await renderTestProvider(
      <TestComponent />,
      {
        menu: [
          {
            label: "Menu 1",
            target: "/menu1",
          },
        ],
      },
    );

    expect(queryByText("Lorem Ipsum")).not.toBeInTheDocument();

    const addBannerBtn = getByText("Add Banner");
    await user.click(addBannerBtn);

    expect(getByText("Lorem Ipsum")).toBeInTheDocument();

    const closeBannerBtn = getByRole("button", {
      name: "Close banner",
    });
    await user.click(closeBannerBtn);

    expect(queryByText("Lorem Ipsum")).not.toBeInTheDocument();
  });
});
