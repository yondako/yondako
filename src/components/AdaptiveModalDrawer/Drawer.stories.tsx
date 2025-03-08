import type { Meta, StoryObj } from "@storybook/react";
import Drawer from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Common/AdaptiveModalDrawer/Drawer",
  component: Drawer,
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    open: true,
    children: () => <p data-testid="content">ドロワーです！</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {};
