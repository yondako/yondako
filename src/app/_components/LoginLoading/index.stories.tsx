import type { Meta, StoryObj } from "@storybook/react";
import LoginLoading from ".";

const meta: Meta<typeof LoginLoading> = {
  title: "Pages/Auth/LoginLoading",
  component: LoginLoading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ログイン処理中に表示されるローディング画面コンポーネント。フルスクリーンで表示され、ユーザーにログイン処理の進行状況を知らせます。",
      },
    },
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
        story:
          "基本的なログインローディング画面の表示例。タコのアニメーションとローディングメッセージが表示されます。",
      },
    },
  },
};
