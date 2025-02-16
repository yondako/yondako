import { createDummyBookDetail } from "@/_mocks/book";
import type { BookDetailWithoutId } from "@/types/book.js";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
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

// デフォルト
export const Default: Story = {
  args: {
    data: {
      detail: mockDetail,
      readingStatus: "reading",
    },
  },
};

// 著者が無い場合
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

// クリックで書籍詳細が開くか
export const OpenClose: Story = {
  name: "書籍詳細を開ける",
  args: {
    data: {
      detail: mockDetail,
      readingStatus: "reading",
    },
  },
  play: async ({ canvasElement, step, args }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const canvas = within(canvasElement.parentElement!);

    await step("ダイアログが開く", async () => {
      const bookCard = canvas.getByTestId("book-card");
      await userEvent.click(bookCard);

      await waitFor(() =>
        expect(canvas.getByTestId("book-title")).toHaveTextContent(
          args.data.detail.title,
        ),
      );
    });
  },
};
