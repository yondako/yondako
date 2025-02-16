import type { Meta, StoryObj } from "@storybook/react";
import LogoutButton from ".";

const meta: Meta<typeof LogoutButton> = {
  title: "App/Framed/Settings/LogoutButton",
  component: LogoutButton,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {};
