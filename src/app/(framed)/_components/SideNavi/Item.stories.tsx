import IconBellFilled from "@/assets/icons/bell-filled.svg";
import IconBell from "@/assets/icons/bell.svg";
import type { Meta, StoryObj } from "@storybook/react";
import Item from "./Item";

const meta: Meta<typeof Item> = {
  title: "Navigation/SideNaviItem",
  component: Item,
  render: (args) => (
    <div className="w-48 space-y-4">
      <Item {...args} current />
      <Item {...args} />
      <Item {...args} badge current />
      <Item {...args} badge />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Item>;

export const All: Story = {
  args: {
    title: "Home",
    IconSolid: IconBell,
    IconFilled: IconBellFilled,
    href: "/",
  },
};