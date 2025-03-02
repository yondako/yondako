import { createDummyBookDetail } from "@/_mocks/book";
import type { BookType } from "@/types/book";
import type { Meta, StoryObj } from "@storybook/react";
import BookList from "./index";

const meta: Meta<typeof BookList> = {
  title: "Common/BookList",
  component: BookList,
};

export default meta;
type Story = StoryObj<typeof BookList>;

const sampleBooks: BookType[] = [
  {
    detail: {
      ...createDummyBookDetail("0"),
      jpeCode: undefined,
      isbn: undefined,
    },
    readingStatus: "want_read",
  },
  {
    detail: {
      ...createDummyBookDetail("1"),
      jpeCode: undefined,
      isbn: undefined,
    },
    readingStatus: "reading",
  },
  {
    detail: {
      ...createDummyBookDetail("2"),
      jpeCode: undefined,
      isbn: undefined,
    },
    readingStatus: "read",
  },
];

export const Default: Story = {
  args: {
    items: sampleBooks,
  },
};
