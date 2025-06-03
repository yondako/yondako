import { createDummyBookDetail } from "@/_mocks/book";
import type { BookDetailWithoutId } from "@/types/book.js";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import BookCard from "./index";

const mockDetail: BookDetailWithoutId = {
  ...createDummyBookDetail("1234567890"),
  jpeCode: undefined,
  isbn: undefined,
};

const meta: Meta<typeof BookCard> = {
  title: "Components/BookCard",
  component: BookCard,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    data: {
      description: "書籍データ（詳細情報と読書ステータス）",
      control: false,
    },
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なBookCardの表示例。書籍のタイトル、著者、表紙画像を表示します。",
      },
    },
  },
};

export const WithoutAuthor: Story = {
  parameters: {
    docs: {
      description: {
        story: "著者情報がない場合の表示例。著者名の部分が非表示になります。",
      },
    },
  },
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

export const NarrowWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: "幅が狭い場合の表示例。メニューアイコンが非表示になります。",
      },
    },
  },
  render: (args) => {
    return (
      <div className="w-72">
        <BookCard {...args} />
      </div>
    );
  },
};

export const OpenClose: Story = {
  name: "書籍詳細を開ける",
  parameters: {
    docs: {
      description: {
        story:
          "BookCardをクリックすると書籍詳細ダイアログが開く操作をテストします。",
      },
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
