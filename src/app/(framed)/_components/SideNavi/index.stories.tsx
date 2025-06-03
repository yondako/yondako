import type { Meta, StoryObj } from "@storybook/react";
import SideNavi from ".";

const meta: Meta<typeof SideNavi> = {
  title: "Layout/SideNavi",
  component: SideNavi,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "サイドナビゲーションコンポーネント。ライブラリ、ニュース、検索、設定などの主要ページへのナビゲーションを提供します。アクティブページのハイライト表示とバッジ通知機能を含みます。",
      },
    },
  },
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
