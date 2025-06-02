import type { Meta, StoryObj } from "@storybook/react";
import LibraryBookListSkeleton from "./Skeleton";

const meta: Meta<typeof LibraryBookListSkeleton> = {
  title: "Components/LibraryBookList/Skeleton",
  component: LibraryBookListSkeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
