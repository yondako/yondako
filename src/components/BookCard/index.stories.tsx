import type { BookDetailWithoutId } from "@/types/book.js";
import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookCard from "./index";

const meta: Meta<typeof BookCard> = {
  title: "Common/BookCard",
  component: BookCard,
  render: (args) => {
    return (
      <div className="w-96">
        <BookCard {...args} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof BookCard>;

const mockDetail: BookDetailWithoutId = {
  ...createDummyBookDetail("1234567890"),
  jpeCode: undefined,
  isbn: undefined,
};

export const Default: Story = {
  args: {
    data: {
      detail: mockDetail,
      readingStatus: "reading",
    },
  },
};

export const WithoutAuthor: Story = {
  args: {
    data: {
      detail: {
        ...mockDetail,
        authors: undefined,
      },
      readingStatus: "reading",
    },
  },
};
