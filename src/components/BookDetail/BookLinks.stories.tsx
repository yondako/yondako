import type { Meta, StoryObj } from "@storybook/react";
import BookLinks from "./BookLinks";

const meta: Meta<typeof BookLinks> = {
  title: "Components/BookDetail/BookLinks",
  component: BookLinks,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    isbn: {
      description: "書籍のISBN。外部サイトへのリンク生成に使用されます",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookLinks>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なBookLinksの表示例。指定されたISBNに基づいて異なる外部サイトへのリンクを表示します。",
      },
    },
  },
  args: {
    isbn: "9784253142366",
    ndlLink: "https://ndlsearch.ndl.go.jp/books/R100000002-I000000000000-00",
  },
};
