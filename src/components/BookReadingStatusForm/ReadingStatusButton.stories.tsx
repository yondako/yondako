import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { Meta, StoryObj } from "@storybook/react";
import BookReadingStatusButton from "./ReadingStatusButton";

const meta: Meta<typeof BookReadingStatusButton> = {
  title: "Common/BookReadingStatusForm/BookReadingStatusButton",
  component: (props) => {
    return (
      <div className="flex space-x-4">
        <div className="space-y-2 text-center">
          <p>Normal</p>
          <BookReadingStatusButton {...props} />
        </div>
        <div className="space-y-2 text-center">
          <p>Selected</p>
          <BookReadingStatusButton {...props} selected />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof BookReadingStatusButton>;

const sampleMeta: ReadingStatusMetadataItem = {
  label: "よみたい",
  IconSolid: IconBookmarks,
  IconFilled: IconBookmarksFilled,
};

export const Default: Story = {
  args: {
    status: "reading",
    meta: sampleMeta,
    selected: false,
  },
};

export const Compact: Story = {
  args: {
    status: "reading",
    meta: sampleMeta,
    selected: false,
    compact: true,
  },
};
