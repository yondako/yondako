import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import type { Meta, StoryObj } from "@storybook/react";
import { TabItem } from "./TabItem";

const meta: Meta<typeof TabItem> = {
  title: "Pages/Library/Tab/TabItem",
  component: TabItem,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    id: {
      description: "タブアイテムのID（読書ステータス）",
      control: "text",
    },
    meta: {
      description: "タブのメタデータ（ラベル、アイコン）",
      control: false,
    },
    current: {
      description: "現在選択中のタブかどうか",
      control: "boolean",
    },
  },
  args: {
    id: "0",
    meta: {
      label: "読みたい",
      IconSolid: IconBookmarks,
      IconFilled: IconBookmarksFilled,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabItem>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story: "タブアイテムの各種状態を表示。通常状態、ホバー状態、アクティブ状態の違いを確認できます。",
      },
    },
    pseudo: {
      hover: ["[href='/library/hover']"],
    },
  },
  render: (args) => (
    <div className="flex max-w-32 gap-4">
      <TabItem {...args} />
      <TabItem {...args} id="hover" />
      <TabItem {...args} current />
    </div>
  ),
};
