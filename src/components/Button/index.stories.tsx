import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const All: Story = {
  args: {
    children: "ボタンテキスト",
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
        <Button {...args} noBorder />
        <Button {...args} noBorder id="hover" />
      </div>
    </div>
  ),
};
