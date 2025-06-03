import type { Meta, StoryObj } from "@storybook/react";
import BookCardSkeleton from "./Skeleton";

const meta: Meta<typeof BookCardSkeleton> = {
  title: "Components/BookCard/Skeleton",
  component: BookCardSkeleton,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    pageReadingStatus: {
      description:
        "ページの読書ステータス。スケルトンの表示スタイルに影響します",
      control: { type: "radio" },
      options: ["read", "reading", "want_read"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なBookCardスケルトンの表示例。",
      },
    },
  },
  args: {},
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story: "異なる読書ステータスのBookCardスケルトンを複数表示する例。",
      },
    },
  },
  render: () => (
    <div className="grid max-w-md grid-cols-1 gap-4">
      <BookCardSkeleton pageReadingStatus="read" />
      <BookCardSkeleton pageReadingStatus="reading" />
      <BookCardSkeleton pageReadingStatus="want_read" />
    </div>
  ),
};
