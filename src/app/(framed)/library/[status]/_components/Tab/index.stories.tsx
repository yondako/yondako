import type { Meta, StoryObj } from "@storybook/react";
import Tab from ".";

const meta: Meta<typeof Tab> = {
  title: "Pages/Library/Tab",
  component: Tab,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    current: {
      description: "現在選択されている読書ステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なライブラリタブの表示例。「よみたい」タブがアクティブな状態で表示され、他のタブも確認できます。",
      },
    },
  },
  args: {
    current: "want_read",
  },
};
