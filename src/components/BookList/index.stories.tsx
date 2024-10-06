import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "#src/_mocks/book";
import type { BookType } from "#src/types/book";
import BookList from "./";

const meta: Meta<typeof BookList> = {
  title: "Common/BookList",
  component: BookList,
};

export default meta;
type Story = StoryObj<typeof BookList>;

const sampleBooks: BookType[] = [
  {
    detail: createDummyBookDetail("0"),
    readingStatus: "want_read",
  },
  {
    detail: createDummyBookDetail("1"),
    readingStatus: "reading",
  },
  {
    detail: createDummyBookDetail("2"),
    readingStatus: "read",
  },
];

export const Default: Story = {
  args: {
    items: sampleBooks,
  },
};
