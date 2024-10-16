import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import type { Meta, StoryObj } from "@storybook/react";
import { TabItem } from "./TabItem";

const meta: Meta<typeof TabItem> = {
  title: "Library/Tab/TabItem",
  component: TabItem,
  args: {
    id: "0",
    meta: {
      label: "読みたい",
      IconSolid: IconBookmarks,
      IconFilled: IconBookmarksFilled,
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabItem>;

export const All: Story = {
  render: (args) => (
    <div className="flex max-w-32 gap-4">
      <TabItem {...args} />
      <TabItem {...args} id="hover" />
      <TabItem {...args} current />
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ["[href='/library/hover']"],
    },
  },
};
