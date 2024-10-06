import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookDetailContent from "./Content";

const meta: Meta<typeof BookDetailContent> = {
  title: "Common/BookDetail/BookDetailContent",
  component: BookDetailContent,
  argTypes: {
    onChangeStatus: { action: "onChangeStatus" },
    onChangeOptimisticStatus: { action: "onChangeOptimisticStatus" },
  },
  args: {
    Title: DialogTitle,
    Description: DialogDescription,
    status: "reading",
    optimisticStatus: "reading",
  },
  render: (args) => (
    <Dialog>
      <BookDetailContent {...args} />
    </Dialog>
  ),
};

export default meta;
type Story = StoryObj<typeof BookDetailContent>;

export const Default: Story = {
  args: {
    data: {
      detail: createDummyBookDetail("1234567890"),
      readingStatus: "reading",
    },
  },
};

export const MultipleValue: Story = {
  args: {
    data: {
      detail: {
        ...createDummyBookDetail("1234567890"),
        authors: ["author1", "author2"],
        publishers: ["publisher1", "publisher2"],
      },
      readingStatus: "reading",
    },
  },
};

export const WithoutAuthor: Story = {
  args: {
    data: {
      detail: {
        ...createDummyBookDetail("1234567890"),
        authors: undefined,
      },
      readingStatus: "reading",
    },
  },
};

export const WithoutPublisher: Story = {
  args: {
    data: {
      detail: {
        ...createDummyBookDetail("1234567890"),
        publishers: undefined,
      },
      readingStatus: "reading",
    },
  },
};
