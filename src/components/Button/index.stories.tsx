import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "ボタンテキスト",
  },
};

export const Link: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com/">リンクテキスト</a>,
  },
};
