import type { Meta, StoryObj } from "@storybook/react";
import CategoryButton from "./CategoryButton";

const meta: Meta<typeof CategoryButton> = {
  title: "Search/CategoryButton",
  component: CategoryButton,
  args: {
    label: "カテゴリ",
    checked: false,
  },
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <CategoryButton {...args} />
        <CategoryButton {...args} id="hover" />
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof CategoryButton>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};
