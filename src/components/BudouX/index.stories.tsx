import type { Meta, StoryObj } from "@storybook/react";
import BudouX from ".";

const meta: Meta<typeof BudouX> = {
  title: "Components/BudouX",
  component: BudouX,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    children: {
      description: "改行処理を行うテキスト",
      control: { type: "text" },
    },
    className: {
      description: "追加のCSSクラス",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BudouX>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "異なる幅のコンテナでのBudouXの改行動作を確認できます。赤枠内でテキストが適切に改行されます。",
      },
    },
  },
  args: {
    children: "これはテストの文章です。適切な位置で改行されているはずです。",
  },
  render: (args) => {
    return (
      <>
        <p>w-32</p>
        <div className="w-32 border border-red-500 bg-white">
          <BudouX {...args} />
        </div>
        <p className="mt-4">w-64</p>
        <div className="w-64 border border-red-500 bg-white">
          <BudouX {...args} />
        </div>
      </>
    );
  },
};
