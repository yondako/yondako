import type { Meta, StoryObj } from "@storybook/react";
import LoginLoading from ".";

const meta: Meta<typeof LoginLoading> = {
  title: "App/LoginLoading",
  component: LoginLoading,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    show: true,
  },
};

export default meta;
type Story = StoryObj<typeof LoginLoading>;

export const Default: Story = {};
