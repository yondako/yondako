import type { Meta, StoryObj } from "@storybook/react";
import Drawer from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Components/AdaptiveModalDrawer/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "モバイル環境でボトムシートドロワーとして表示される適応型コンポーネント。画面下部からスライドアップして表示され、ドラッグまたは背景タップで閉じることができます。",
      },
    },
  },
  argTypes: {
    open: {
      description: "ドロワーの開閉状態",
      control: "boolean",
    },
    onOpenChange: {
      description: "ドロワーの開閉状態が変更された時のコールバック関数",
      action: "onOpenChange",
    },
    children: {
      description: "ドロワー内に表示するコンテンツ",
      control: false,
    },
    triggerChildren: {
      description: "ドロワーを開くトリガーとなる要素",
      control: false,
    },
  },
  args: {
    open: true,
    children: () => <p data-testid="content">ドロワーです！</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なドロワーの表示状態。デフォルトで開いた状態で表示され、モバイル環境でのボトムシート表示を確認できます。",
      },
    },
  },
};
