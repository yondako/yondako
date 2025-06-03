import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionBlock } from "./DescriptionBlock";

const meta: Meta<typeof DescriptionBlock> = {
  title: "Components/BookDetail/DescriptionBlock",
  component: DescriptionBlock,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    label: {
      description: "表示するラベル",
      control: { type: "text" },
    },
    values: {
      description: "表示する値の配列",
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptionBlock>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story: "DescriptionBlockの表示例。単一値と複数値の表示パターンを並べて表示します。",
      },
    },
  },
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
