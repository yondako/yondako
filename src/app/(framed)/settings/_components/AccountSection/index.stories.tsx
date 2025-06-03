import type { Meta, StoryObj } from "@storybook/react";
import AccountSection from ".";

const meta: Meta<typeof AccountSection> = {
  title: "Pages/Settings/AccountSection",
  component: AccountSection,
  tags: ["autodocs"],
  args: {
    userId: "this-is-user-id",
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountSection>;

export const Default: Story = {};
