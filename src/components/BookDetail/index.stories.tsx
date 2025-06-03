import { createDummyBookDetail } from "@/_mocks/book";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import BookDetail from ".";

const meta: Meta<typeof BookDetail> = {
  title: "Components/BookDetail",
  component: BookDetail,
  tags: ["autodocs"],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
  argTypes: {
    open: {
      description: "ダイアログの表示状態",
      control: { type: "boolean" },
    },
    bookDetailProps: {
      description: "書籍詳細のプロパティ",
      control: false,
    },
  },
  args: {
    open: true,
    bookDetailProps: {
      data: {
        detail: {
          ...createDummyBookDetail("1234567890"),
          jpeCode: undefined,
          isbn: undefined,
        },
        readingStatus: "reading",
      },
      status: "reading",
      onChangeStatus: fn(),
      optimisticStatus: "reading",
      onChangeOptimisticStatus: fn(),
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookDetail>;

export const Desktop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "デスクトップ表示での書籍詳細ダイアログ。モーダルとして中央に表示されます。",
      },
    },
    viewport: {
      defaultViewport: "ipad12p",
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "モバイル表示での書籍詳細ダイアログ。下からスライドアップするドロワーとして表示されます。",
      },
    },
    viewport: {
      defaultViewport: "iphone14",
    },
  },
};
