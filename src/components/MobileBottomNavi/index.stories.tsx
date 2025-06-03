import type { Meta, StoryObj } from "@storybook/react";
import MobileBottomNavi from ".";

const meta: Meta<typeof MobileBottomNavi> = {
  title: "Components/MobileBottomNavi",
  component: MobileBottomNavi,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof MobileBottomNavi>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なMobileBottomNaviの表示例。ライブラリページがアクティブ状態で表示されます。",
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
