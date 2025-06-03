import type { Meta, StoryObj } from "@storybook/react";
import SideNavi from ".";

const meta: Meta<typeof SideNavi> = {
  title: "Layout/SideNavi",
  component: SideNavi,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof SideNavi>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なサイドナビゲーションの表示例。ライブラリページがアクティブな状態で表示されます。各ナビゲーション項目のアイコンとラベルが確認できます。",
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["library"],
      },
    },
  },
};
