import type { Meta, StoryObj } from "@storybook/react";
import Tab from ".";

const meta: Meta<typeof Tab> = {
  title: "Library/Tab",
  component: Tab,
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    current: "want_read",
  },
};
