import IconBellFilled from "@/assets/icons/bell-filled.svg";
import IconBell from "@/assets/icons/bell.svg";
import type { Meta, StoryObj } from "@storybook/react";
import Item from "./Item";

const meta: Meta<typeof Item> = {
  title: "Layout/SideNavi/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover: ["[href='/hover']"],
    },
  },
  argTypes: {
    title: {
      description: "ナビゲーション項目のタイトル",
      control: "text",
    },
    IconSolid: {
      description: "通常状態で表示するアイコンコンポーネント",
      control: false,
    },
    IconFilled: {
      description: "アクティブ状態で表示するアイコンコンポーネント",
      control: false,
    },
    href: {
      description: "リンク先のパス",
      control: "text",
    },
    current: {
      description: "現在のページかどうか",
      control: "boolean",
    },
    badge: {
      description: "通知バッジを表示するかどうか",
      control: "boolean",
    },
  },
  render: (args) => (
    <div className="w-48 space-y-4">
      <Item {...args} current />
      <Item {...args} />
      <Item {...args} href="hover" />
      <Item {...args} badge current />
      <Item {...args} badge />
      <Item {...args} badge href="hover" />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Item>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ナビゲーション項目の各種状態を表示。アクティブ状態、通常状態、ホバー状態、バッジ付きの各パターンを確認できます。",
      },
    },
  },
  args: {
    title: "Home",
    IconSolid: IconBell,
    IconFilled: IconBellFilled,
    href: "/",
  },
};
