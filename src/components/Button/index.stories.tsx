import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "汎用的なボタンコンポーネント。複数のスタイルバリエーションを提供し、リンクとしても使用できます。",
      },
    },
    pseudo: {
      hover: ["#hover"],
    },
  },
  argTypes: {
    children: {
      description: "ボタンの表示内容",
    },
    style: {
      description: "ボタンのスタイル",
      control: { type: "radio" },
      options: ["default", "accent", "noBorder"],
    },
    asChild: {
      description: "子要素を直接レンダリングするかどうか",
    },
  },
  args: {
    children: "これはボタン",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} />
        <Button {...args} id="hover" />
      </div>
      <div className="space-x-4">
        <Button {...args} style="accent" />
        <Button {...args} style="accent" id="hover" />
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

export const WithButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なButtonの表示例。3つのスタイル（default、accent、noBorder）とホバー状態を表示します。",
      },
    },
  },
};

export const WithLink: Story = {
  parameters: {
    docs: {
      description: {
        story: "asChildプロパティを使用してリンク要素として使用する例。",
      },
    },
  },
  args: {
    asChild: true,
    children: (
      <a href="https://example.com" className="inline-block">
        これはリンク
      </a>
    ),
  },
};
