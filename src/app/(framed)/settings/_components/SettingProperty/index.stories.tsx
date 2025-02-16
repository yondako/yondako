import type { Meta, StoryObj } from "@storybook/react";
import SettingProperty from ".";

const meta: Meta<typeof SettingProperty> = {
  title: "App/Framed/Settings/SettingProperty",
  component: SettingProperty,
};

export default meta;
type Story = StoryObj<typeof SettingProperty>;

export const Default: Story = {
  args: {
    title: "タイトル",
    description: "ここに説明を入れる",
    children: <button>Button</button>,
  },
  render: (args) => (
    <div className="p-4">
      <SettingProperty {...args} />
    </div>
  ),
};
