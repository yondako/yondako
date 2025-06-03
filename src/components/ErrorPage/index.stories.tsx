import type { Meta, StoryObj } from "@storybook/react";
import ErrorPage from ".";

const meta: Meta<typeof ErrorPage> = {
  title: "Components/ErrorPage",
  component: ErrorPage,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    title: {
      description: "エラーのタイトル",
      control: { type: "text" },
    },
    children: {
      description: "エラーの詳細説明",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なエラーページの表示例。カスタムタイトルと説明文を表示します。",
      },
    },
  },
  args: {
    title: "エラータイトル",
    children: <p>ここにエラーの説明を入れる</p>,
  },
};
