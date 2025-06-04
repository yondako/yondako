import type { Meta, StoryObj } from "@storybook/react";
import LoginLoading from ".";

const meta: Meta<typeof LoginLoading> = {
  title: "Pages/Auth/LoginLoading",
  component: LoginLoading,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    show: {
      description: "ローディング画面の表示状態",
      control: "boolean",
    },
  },
  args: {
    show: true,
  },
};

export default meta;
type Story = StoryObj<typeof LoginLoading>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なログインローディング画面の表示例。タコのアニメーションとローディングメッセージが表示されます。",
      },
    },
  },
};
