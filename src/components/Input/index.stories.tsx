import type { Meta, StoryObj } from "@storybook/react";
import Input from ".";

const meta: Meta<typeof Input> = {
  title: "Common/Input",
  component: () => {
    return (
      <div className="max-w-96 space-y-6">
        <Input />
        <Input placeholder="プレースホルダー" />
        <Input value="テキスト" />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
