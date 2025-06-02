import type { Meta, StoryObj } from "@storybook/react";
import BookCardSkeleton from "./Skeleton";

const meta: Meta<typeof BookCardSkeleton> = {
  title: "Components/BookCard/Skeleton",
  component: BookCardSkeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  render: () => (
    <div className="grid max-w-md grid-cols-1 gap-4">
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
    </div>
  ),
};
