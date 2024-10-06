import type { Meta, StoryObj } from "@storybook/react";
import BudouX from ".";

const meta: Meta<typeof BudouX> = {
  title: "Common/BudouX",
  component: (props) => {
    return (
      <>
        <p>w-32</p>
        <div className="w-32 border border-red-500 bg-white">
          <BudouX {...props} />
        </div>
        <p className="mt-4">w-64</p>
        <div className="w-64 border border-red-500 bg-white">
          <BudouX {...props} />
        </div>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof BudouX>;

export const All: Story = {
  args: {
    children: "これはテストの文章です。適切な位置で改行されているはずです。",
  },
};
