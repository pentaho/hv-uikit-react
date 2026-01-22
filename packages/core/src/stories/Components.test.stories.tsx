import type { Meta, StoryObj } from "@storybook/react-vite";
import { renderStory, setupChromatic } from "@hitachivantara/internal";

import { Disabled as AccordionDisabledStory } from "../Accordion/Accordion.stories";
import { Main as ActionBarMainStory } from "../ActionBar/ActionBar.stories";
import {
  Main as AppSwitcherMainStory,
  ManyEntries as AppSwitcherManyEntriesStory,
} from "../AppSwitcher/AppSwitcher.stories";
import { Test as AvatarTestStory } from "../Avatar/Avatar.stories";
import { Test as AvatarGroupTestStory } from "../AvatarGroup/AvatarGroup.stories";
import { Test as BadgeTestStory } from "../Badge/Badge.stories";
import { Variants as BannerVariantsStory } from "../Banner/Banner.stories";
import { Test as BreadCrumbTestStory } from "../BreadCrumb/BreadCrumb.stories";
import { Test as BulkActionsTestStory } from "../BulkActions/BulkActions.stories";
import { Test as ButtonTestStory } from "../Button/Button.stories";
import { Variants as CardVariantsStory } from "../Card/Card.stories";
import {
  Actions as CarouselActionsStory,
  Embedded as CarouselEmbeddedStory,
} from "../Carousel/Carousel.stories";
import { Test as CheckBoxTestStory } from "../CheckBox/CheckBox.stories";
import { Variants as CheckBoxGroupVariantsStory } from "../CheckBoxGroup/CheckBoxGroup.stories";
import { Test as ColorPickerTestStory } from "../ColorPicker/ColorPicker.stories";
import { Main as ContainerMainStory } from "../Container/Container.stories";
import { Main as DotPaginationMainStory } from "../DotPagination/DotPagination.stories";
import {
  MultiSelection as DropdownMultiSelectionStory,
  Variants as DropdownVariantsStory,
} from "../Dropdown/Dropdown.stories";
import { Main as DropDownMenuMainStory } from "../DropDownMenu/DropDownMenu.stories";
import {
  Minimal as EmptyStateMinimalStory,
  WithAction as EmptyStateWithActionStory,
} from "../EmptyState/EmptyState.stories";
import { WithPreviewThumbnails as FileUploaderWithPreviewThumbnailsStory } from "../FileUploader/FileUploader.stories";
import { Main as FooterCustomLabelsStory } from "../Footer/Footer.stories";
import { Test as GlobalActionsTestStory } from "../GlobalActions/GlobalActions.stories";
import { TheDesignSystemColumns as GridTheDesignSystemColumnsStory } from "../Grid/Grid.stories";
import { Test as HeaderTestStory } from "../Header/Header.stories";
import { Variants as IconButtonVariantsStory } from "../IconButton/IconButton.stories";
import { Test as InlineEditorTestStory } from "../InlineEditor/InlineEditor.stories";
import { Test as InputTestStory } from "../Input/Input.stories";
import { WithIcons as ListContainerWithIconsStory } from "../ListContainer/ListContainer.stories";
import { Variants as LoadingVariantsStory } from "../Loading/Loading.stories";
import { Test as MultiButtonTestStory } from "../MultiButton/MultiButton.stories";
import { Main as OverflowTooltipMainStory } from "../OverflowTooltip/OverflowTooltip.stories";
import { Main as PaginationMainStory } from "../Pagination/Pagination.stories";
import { Main as PanelMainStory } from "../Panel/Panel.stories";
import { Variants as ProgressBarVariantsStory } from "../ProgressBar/ProgressBar.stories";
import { Test as RadioTestStory } from "../Radio/Radio.stories";
import {
  Horizontal as RadioGroupHorizontalStory,
  Variants as RadioGroupVariantsStory,
} from "../RadioGroup/RadioGroup.stories";
import { Main as ScrollToHorizontalMainStory } from "../ScrollToHorizontal/ScrollToHorizontal.stories";
import { Main as ScrollToVerticalMainStory } from "../ScrollToVertical/ScrollToVertical.stories";
import { Test as SectionTestStory } from "../Section/Section.stories";
import { Test as SelectTestStory } from "../Select/Select.stories";
import { Variants as SelectionListVariantsStory } from "../SelectionList/SelectionList.stories";
import { Main as SimpleGridMainStory } from "../SimpleGrid/SimpleGrid.stories";
import { Variants as SkeletonVariantsStory } from "../Skeleton/Skeleton.stories";
import { RangeVariants as SliderRangeVariantsStory } from "../Slider/Slider.stories";
import { Variants as SnackbarVariantsStory } from "../Snackbar/Snackbar.stories";
import { Test as StackTestStory } from "../Stack/Stack.stories";
import { Test as StatusIconTestStory } from "../StatusIcon/StatusIcon.stories";
import { Variants as SwitchVariantsStory } from "../Switch/Switch.stories";
import { Test as TabsTestStory } from "../Tabs/Tabs.stories";
import { Test as TagTestStory } from "../Tag/Tag.stories";
import { Variants as TagsInputVariantsStory } from "../TagsInput/TagsInput.stories";
import { Variants as TextAreaVariantsStory } from "../TextArea/TextArea.stories";
import { Multiple as ToggleButtonMultipleStory } from "../ToggleButton/ToggleButton.stories";
import { Test as TypographyTestStory } from "../Typography/Typography.stories";

/** Visual tests for components from the Core package */
export default {
  title: "Tests/Components",
  tags: ["skipTestRunner"],
} satisfies Meta;

/** Basic inputs */
export const TestInputs: StoryObj = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  render: (args, context: any) => (
    <div className="grid gap-xs">
      <div className="flex gap-xs items-start">
        <div className="grid grid-cols-2 gap-xs w-440px">
          {renderStory(InputTestStory, context)}
        </div>
        <div className="grid gap-xs w-160px [&>*]:w-160px">
          {renderStory(TextAreaVariantsStory, context)}
        </div>
        <div className="grid gap-xs w-120px">
          {renderStory(CheckBoxGroupVariantsStory, context)}
        </div>
        <div className="grid gap-xs w-120px">
          {renderStory(RadioGroupVariantsStory, context)}
        </div>
        <div className="grid w-160px">
          {renderStory(CheckBoxTestStory, context)}
        </div>
        <div className="grid gap-sm w-120px">
          <div className="flex w-full flex-wrap">
            {renderStory(RadioTestStory, context)}
          </div>
          <div className="flex w-full flex-wrap">
            {renderStory(SwitchVariantsStory, context)}
          </div>
        </div>
        <div className="grid gap-xs flex-1">
          {renderStory(SliderRangeVariantsStory, context)}
          <div className="flex gap-xs">
            {renderStory(SelectionListVariantsStory, context)}
          </div>
          {renderStory(RadioGroupHorizontalStory, context)}
        </div>
      </div>
      <div className="flex gap-sm w-full flex-wrap [&>*]:w-220px">
        {renderStory(TagsInputVariantsStory, context)}
      </div>
      <div>{renderStory(InlineEditorTestStory, context)}</div>
      <div className="w-400px">
        {renderStory(FileUploaderWithPreviewThumbnailsStory, context)}
      </div>
    </div>
  ),
};

/** Inputs that have popups */
export const TestPopups: StoryObj = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  render: (args, context: any) => (
    <div className="flex gap-md items-start">
      <div className="grid gap-xs w-240px">
        {renderStory(SelectTestStory, context)}
      </div>
      <div className="grid gap-xs w-240px">
        {renderStory(DropdownVariantsStory, context)}
        {DropdownMultiSelectionStory.render?.({ expanded: true }, context)}
      </div>
      <div>
        {renderStory(OverflowTooltipMainStory, context)}
        <div className="flex gap-xs mt-80px">
          {renderStory(ColorPickerTestStory, context)}
        </div>
      </div>
      <div className="ml-auto">
        {renderStory(DropDownMenuMainStory, context)}
      </div>
      <div className="grid w-340px">
        {renderStory(SnackbarVariantsStory, context)}
      </div>
    </div>
  ),
};

/** Components that are mostly buttons/actions or containers for actions */
export const TestButtons: StoryObj = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  play: async ({ canvas, userEvent }) => {
    // navigate to pagination last page
    await userEvent.click(canvas.getByRole("button", { name: /last page/i }));
  },
  render: (args, context: any) => (
    <div className="grid gap-sm">
      <div>{renderStory(ButtonTestStory, context)}</div>
      <div className="flex gap-sm">
        <div>{renderStory(ToggleButtonMultipleStory, context)}</div>
        <div>{renderStory(IconButtonVariantsStory, context)}</div>
      </div>
      <div>{renderStory(MultiButtonTestStory, context)}</div>
      <div className="flex flex-wrap gap-x-xs">
        {renderStory(BreadCrumbTestStory, context)}
      </div>
      <div>{renderStory(TagTestStory, context)}</div>
      <div className="grid grid-cols-3 gap-sm">
        {renderStory(GlobalActionsTestStory, context)}
        {renderStory(BulkActionsTestStory, context)}
      </div>
      <div className="grid grid-cols-2 gap-xs">
        <div>
          {renderStory(ActionBarMainStory, context)}
          {renderStory(DotPaginationMainStory, context)}
        </div>
        <div>{renderStory(PaginationMainStory, context)}</div>
      </div>
      {renderStory(TabsTestStory, context)}
    </div>
  ),
};

/** Surfaces and other containers */
export const TestSurfaces: StoryObj = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  render: (args, context: any) => (
    <div className="flex gap-sm items-start">
      <div className="flex flex-col gap-xs w-340px">
        {renderStory(CardVariantsStory, context)}
        {renderStory(AppSwitcherMainStory, context)}
      </div>
      <div className="grid gap-xs w-340px">
        {renderStory(SectionTestStory, context)}
        {renderStory(ListContainerWithIconsStory, context)}
      </div>
      <div className="grid gap-xs flex-1">
        {renderStory(BannerVariantsStory, context)}
        {renderStory(FooterCustomLabelsStory, context)}
        <div className="mb-60px">{renderStory(HeaderTestStory, context)}</div>
        {renderStory(AppSwitcherManyEntriesStory, context)}
      </div>
    </div>
  ),
};

/** Misc components */
export const TestOthers: StoryObj = {
  parameters: {
    ...setupChromatic("all", 5000),
  },
  play: async ({ canvas, userEvent }) => {
    // Accordion disabled story
    const button = canvas.getByRole("button", { name: "System" });
    await userEvent.click(button);
  },
  render: (args, context: any) => (
    <div className="grid gap-xs">
      <div className="flex gap-md">
        {renderStory(AvatarGroupTestStory, context)}
        <div className="flex flex-col gap-xs">
          {renderStory(AvatarTestStory, context)}
          {renderStory(EmptyStateWithActionStory, context)}
          {renderStory(EmptyStateMinimalStory, context)}
        </div>
        <div className="flex flex-col gap-sm flex-1">
          <div>{renderStory(ProgressBarVariantsStory, context)}</div>
          <div className="flex gap-sm">
            <div className="flex flex-col gap-xs">
              {renderStory(LoadingVariantsStory, context)}
            </div>
            {renderStory(SkeletonVariantsStory, context)}
            {renderStory(AccordionDisabledStory, context)}
          </div>
        </div>
      </div>
      {renderStory(BadgeTestStory, context)}
      {renderStory(StatusIconTestStory, context)}
      <div className="flex gap-sm">
        {renderStory(CarouselEmbeddedStory, context)}
        <div className="w-650px">
          {renderStory(CarouselActionsStory, context)}
        </div>
        <div>{renderStory(TypographyTestStory, context)}</div>
      </div>
      <div className="grid grid-cols-2 gap-sm">
        {renderStory(ScrollToHorizontalMainStory, context)}
        {renderStory(ScrollToVerticalMainStory, context)}
      </div>
    </div>
  ),
};

/** Structural components */
export const TestStructure: StoryObj = {
  parameters: {
    ...setupChromatic("default", 5000),
  },
  render: (args, context: any) => (
    <div className="grid gap-sm">
      {renderStory(GridTheDesignSystemColumnsStory, context)}
      <div className="flex gap-xs">
        <div className="grid gap-sm">
          {renderStory(StackTestStory, context)}
        </div>
        <div className="grid grid-cols-3 gap-sm flex-1">
          {renderStory(PanelMainStory, context)}
          {renderStory(SimpleGridMainStory, context)}
          <div>{renderStory(ContainerMainStory, context)}</div>
        </div>
      </div>
    </div>
  ),
};
