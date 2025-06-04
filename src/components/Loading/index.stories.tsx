import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from ".";

const meta: Meta<typeof Loading> = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    title: {
      description: "ローディング中に表示するタイトル",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なLoadingコンポーネントの表示例。タコのアニメーションとタイトルが表示されます。",
      },
    },
  },
  args: {
    title: "タイトル",
  },
};
