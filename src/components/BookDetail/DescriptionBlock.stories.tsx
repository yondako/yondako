import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionBlock } from "./DescriptionBlock";

const meta: Meta<typeof DescriptionBlock> = {
  title: "Common/BookDetail/DescriptionBlock",
  component: DescriptionBlock,
};

export default meta;
type Story = StoryObj<typeof DescriptionBlock>;

export const Default: Story = {
  args: {
    label: "ラベル",
    values: ["値1", "値2", "値3"],
  },
};

export const SingleValue: Story = {
  args: {
    label: "ラベル",
    values: ["単一の値"],
  },
};
