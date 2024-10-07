import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionBlock } from "./DescriptionBlock";

const meta: Meta<typeof DescriptionBlock> = {
  title: "Common/BookDetail/DescriptionBlock",
  component: DescriptionBlock,
};

export default meta;
type Story = StoryObj<typeof DescriptionBlock>;

export const All: Story = {
  args: {
    label: "ラベル",
    values: ["値1", "値2", "値3"],
  },
  render: (args) => {
    return (
      <div className="flex gap-8">
        <DescriptionBlock {...args} values={args.values.slice(0, 1)} />
        <DescriptionBlock {...args} />
      </div>
    );
  },
};
