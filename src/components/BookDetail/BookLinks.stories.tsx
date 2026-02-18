import type { Meta, StoryObj } from "@storybook/react";
import BookLinks from "./BookLinks";

const meta: Meta<typeof BookLinks> = {
  title: "Components/BookDetail/BookLinks",
  component: BookLinks,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookLinks>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "ISBNがある場合の表示。楽天市場、国立国会図書館、Booksへのリンクが表示されます。",
      },
    },
  },
  args: {
    title: "サンプルタイトル",
    isbn: "9784253142366",
    ndlLink: "https://example.com/",
  },
};

export const WithoutISBN: Story = {
  parameters: {
    docs: {
      description: {
        story: "ISBNがない場合の表示。国立国会図書館へのリンクのみが表示されます。",
      },
    },
  },
  args: {
    title: "サンプルタイトル",
    isbn: null,
    ndlLink: "https://example.com/",
  },
};
