import type { Meta, StoryObj } from "@storybook/react";
import MobileHeader from ".";

const meta: Meta<typeof MobileHeader> = {
  title: "Components/MobileHeader",
  component: MobileHeader,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof MobileHeader>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なMobileHeaderの表示例。アプリケーションのメインヘッダーです。",
      },
    },
  },
};
