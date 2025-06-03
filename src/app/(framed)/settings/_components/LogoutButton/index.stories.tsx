import type { Meta, StoryObj } from "@storybook/react";
import LogoutButton from ".";

const meta: Meta<typeof LogoutButton> = {
  title: "Pages/Settings/LogoutButton",
  component: LogoutButton,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {};
