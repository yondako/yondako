import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookCard from "./index";

const meta: Meta<typeof BookCard> = {
  title: "Common/BookCard",
  component: BookCard,
  render: (args) => {
    return <BookCard {...args} />;
  },
};

export default meta;
type Story = StoryObj<typeof BookCard>;

export const Default: Story = {
  args: {
    data: {
      detail: createDummyBookDetail("1234567890"),
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
