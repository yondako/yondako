import type { Meta, StoryObj } from "@storybook/react";
import CategoryButton from "./CategoryButton";

const meta: Meta<typeof CategoryButton> = {
  title: "Pages/Search/SearchFilter/CategoryButton",
  component: CategoryButton,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
  },
  argTypes: {
    label: {
      description: "カテゴリーのラベル名",
      control: "text",
    },
    checked: {
      description: "ボタンの選択状態",
      control: "boolean",
    },
    value: {
      description: "ボタンの値",
      control: "text",
    },
  },
  args: {
    label: "カテゴリ",
    checked: false,
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <CategoryButton {...args} />
        <CategoryButton {...args} id="hover" />
      </div>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof CategoryButton>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なカテゴリーボタンの表示例。選択前状態とホバー状態を確認できます。",
      },
    },
  },
};

export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "選択状態のカテゴリーボタン表示例。選択時のスタイル変化を確認できます。",
      },
    },
  },
  args: {
    checked: true,
  },
};
