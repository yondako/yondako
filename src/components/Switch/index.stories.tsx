import type { Meta, StoryObj } from "@storybook/react";
import Switch from ".";

const meta: Meta<typeof Switch> = {
  title: "Common/Switch",
  component: Switch,
  args: {
    className: "",
  },
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
  },
  render: (args) => (
    <div className="space-x-4">
      <Switch {...args} />
      <Switch {...args} defaultChecked />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};
