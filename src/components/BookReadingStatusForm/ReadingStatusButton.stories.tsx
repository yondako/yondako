import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { Meta, StoryObj } from "@storybook/react";
import BookReadingStatusButton from "./ReadingStatusButton";

const meta: Meta<typeof BookReadingStatusButton> = {
  title: "Common/BookReadingStatusForm/BookReadingStatusButton",
  component: BookReadingStatusButton,
  render: (args) => {
    return (
      <>
        <div className="flex gap-4">
          <BookReadingStatusButton {...args} />
          <BookReadingStatusButton {...args} selected />
        </div>
        <div className="mt-8 flex gap-4">
          <BookReadingStatusButton {...args} compact />
          <BookReadingStatusButton {...args} compact status="want_read" />
          <BookReadingStatusButton {...args} selected compact />
          <BookReadingStatusButton
            {...args}
            selected
            compact
            status="want_read"
          />
        </div>
      </>
    );
  },
  parameters: {
    pseudo: {
      hover: ["[data-testid=button-status-want_read]"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookReadingStatusButton>;

const sampleMeta: ReadingStatusMetadataItem = {
  label: "よみたい",
  IconSolid: IconBookmarks,
  IconFilled: IconBookmarksFilled,
};

export const All: Story = {
  args: {
    status: "reading",
    meta: sampleMeta,
  },
};
