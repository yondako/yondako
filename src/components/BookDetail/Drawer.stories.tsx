import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookDetailDrawer from "./Drawer";

const meta: Meta<typeof BookDetailDrawer> = {
  title: "Common/BookDetail/BookDetailDrawer",
  component: BookDetailDrawer,
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    bookDetailProps: {
      data: {
        detail: {
          ...createDummyBookDetail("1234567890"),
          jpeCode: undefined,
          isbn: undefined,
        },
        readingStatus: "reading",
      },
      status: "reading",
      onChangeStatus: () => {},
      optimisticStatus: "reading",
      onChangeOptimisticStatus: () => {},
    },
    open: true,
  },
  render: (args) => <BookDetailDrawer {...args} />,
};

export default meta;
type Story = StoryObj<typeof BookDetailDrawer>;

export const Default: Story = {};
