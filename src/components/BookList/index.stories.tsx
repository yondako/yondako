import type { Meta, StoryObj } from "@storybook/react";
import { createDummyBookDetail } from "@/_mocks/book";
import { LibraryRevalidationProvider } from "@/contexts/LibraryRevalidationContext";
import { ModalStateProvider } from "@/contexts/ModalStateContext";
import type { BookType } from "@/types/book";
import BookList from "./index";

const meta: Meta<typeof BookList> = {
  title: "Components/BookList",
  component: BookList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ModalStateProvider>
        <LibraryRevalidationProvider>
          <Story />
        </LibraryRevalidationProvider>
      </ModalStateProvider>
    ),
  ],
  parameters: {},
  argTypes: {
    items: {
      description: "表示する書籍データの配列",
      control: false,
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: "基本的なBookListの表示例。異なる読書ステータスの書籍をいくつか表示します。",
      },
    },
  },
  args: {
    items: sampleBooks,
  },
};
