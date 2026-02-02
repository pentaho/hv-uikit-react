import { HvDropDownMenu, HvDropDownMenuProps } from "../DropDownMenu";
import { HvIcon } from "../icons";

export const removeExtension = (label: string) =>
  label.includes(".") ? label.slice(0, label.lastIndexOf(".")) : label;

export const pathWithSubMenu = (
  id: string | undefined,
  listRoute: any,
  maxVisible: number,
  onClick?: (event: React.MouseEvent<HTMLElement>, data: any) => void,
  dropDownMenuProps?: Partial<HvDropDownMenuProps>,
  moreOptionsPosition = 1,
) => {
  const nbrElemToSubMenu = listRoute.length - maxVisible;
  const subMenuList = listRoute.slice(
    1,
    nbrElemToSubMenu + moreOptionsPosition,
  );

  const handleClick = (event: any, data: any) => {
    event.preventDefault();

    onClick?.(event, data);
  };

  listRoute.splice(
    moreOptionsPosition,
    nbrElemToSubMenu,
    <HvDropDownMenu
      icon={<HvIcon name="DotsHorizontal" />}
      dataList={subMenuList}
      {...dropDownMenuProps}
      onClick={onClick != null ? handleClick : undefined}
    />,
  );

  return listRoute;
};
