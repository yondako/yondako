import type { Meta, StoryObj } from "@storybook/react";
import Input from ".";

const meta: Meta<typeof Input> = {
  title: "Common/Input",
  component: Input,
  render: (args) => {
    return (
      <div className="max-w-96 space-y-6">
        <Input {...args} />
        <Input {...args} placeholder="プレースホルダー" />
        <Input {...args} value="テキスト" />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    search: false,
  },
};

export const Search: Story = {
  args: {
    search: true,
  },
};
