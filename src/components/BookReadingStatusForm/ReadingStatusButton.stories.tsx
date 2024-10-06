import type { Meta, StoryObj } from "@storybook/react";
import IconBookmarksFilled from "#src/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "#src/assets/icons/bookmarks.svg";
import type { ReadingStatusMetadataItem } from "#src/constants/status";
import BookReadingStatusButton from "./ReadingStatusButton";

const meta: Meta<typeof BookReadingStatusButton> = {
  title: "Common/BookReadingStatusForm/BookReadingStatusButton",
  component: (props) => {
    return (
      <>
        <div className="flex gap-4">
          <BookReadingStatusButton {...props} />
          <BookReadingStatusButton {...props} selected />
        </div>
        <div className="mt-8 flex gap-4">
          <BookReadingStatusButton {...props} compact />
          <BookReadingStatusButton {...props} selected compact />
        </div>
      </>
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

export const All: Story = {
  args: {
    status: "reading",
    meta: sampleMeta,
  },
};
