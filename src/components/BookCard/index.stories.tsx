import { createDummyBookDetail } from "@/_mocks/book";
import type { BookDetailWithoutId } from "@/types/book.js";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import BookCard from "./index";

const mockDetail: BookDetailWithoutId = {
  ...createDummyBookDetail("1234567890"),
  jpeCode: undefined,
  isbn: undefined,
};

const meta: Meta<typeof BookCard> = {
  title: "Common/BookCard",
  component: BookCard,
  args: {
    data: {
      detail: mockDetail,
      readingStatus: "reading",
    },
  },
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

// デフォルト
export const Default: Story = {};

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

// 幅が狭い場合はメニューアイコンが消える
export const NarrowWidth: Story = {
  render: (args) => {
    return (
      <div className="w-72">
        <BookCard {...args} />
      </div>
    );
  },
};

// クリックで書籍詳細が開くか
export const OpenClose: Story = {
  name: "書籍詳細を開ける",
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
