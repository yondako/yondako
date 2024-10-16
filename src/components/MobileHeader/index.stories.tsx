import type { Meta, StoryObj } from "@storybook/react";
import MobileHeader from ".";

const meta: Meta<typeof MobileHeader> = {
  title: "Common/MobileHeader",
  component: MobileHeader,
};

export default meta;
type Story = StoryObj<typeof MobileHeader>;

export const Default: Story = {};
