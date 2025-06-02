import type { Meta, StoryObj } from "@storybook/react";
import LibraryBookListSkeleton from "./Skeleton";

const meta: Meta<typeof LibraryBookListSkeleton> = {
  title: "Components/LibraryBookList/Skeleton",
  component: LibraryBookListSkeleton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
