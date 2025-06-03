import type { Meta, StoryObj } from "@storybook/react";
import LandingLayout from ".";

const meta: Meta<typeof LandingLayout> = {
  title: "Components/LandingLayout",
  component: LandingLayout,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    children: {
      description: "メインコンテンツ",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof LandingLayout>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なLandingLayoutの表示例。ロゴ、コンテンツエリア、フッターのレイアウトを確認できます。",
      },
    },
  },
};
