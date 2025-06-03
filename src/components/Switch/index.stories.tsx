import type { Meta, StoryObj } from "@storybook/react";
import Switch from ".";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
  },
  argTypes: {
    defaultChecked: {
      description: "初期チェック状態",
      control: { type: "boolean" },
    },
    checked: {
      description: "制御されたチェック状態",
      control: { type: "boolean" },
    },
    onCheckedChange: {
      description: "チェック状態変更時のコールバック",
      action: "onCheckedChange",
    },
    disabled: {
      description: "無効状態",
      control: { type: "boolean" },
    },
    className: {
      description: "追加のCSSクラス",
    },
  },
  args: {
    className: "",
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なSwitchの表示例。チェック済みとチェックなしの状態を並べて表示します。",
      },
    },
  },
};
