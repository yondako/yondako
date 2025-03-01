import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  args: {
    children: "これはボタン",
  },
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} />
        <Button {...args} id="hover" />
      </div>
      <div className="space-x-4">
        <Button {...args} style="secondary" />
        <Button {...args} style="secondary" id="hover" />
      </div>
      <div className="space-x-4">
        <Button {...args} style="noBorder" />
        <Button {...args} style="noBorder" id="hover" />
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Button>;

export const WithButton: Story = {};

export const WithLink: Story = {
  args: {
    asChild: true,
    children: (
      <a href="https://example.com" className="inline-block">
        これはリンク
      </a>
    ),
  },
};
