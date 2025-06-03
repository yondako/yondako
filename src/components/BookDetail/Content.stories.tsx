import { createDummyBookDetail } from "@/_mocks/book";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react";
import BookDetailContent from "./Content";

const meta: Meta<typeof BookDetailContent> = {
  title: "Components/BookDetail/Content",
  component: BookDetailContent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "本の詳細情報を表示するコンテンツコンポーネント。本のカバー画像、タイトル、著者、出版社、概要などの情報と、読書ステータス変更フォームを統合したモーダル・ドロワー用コンテンツです。",
      },
    },
  },
  argTypes: {
    data: {
      description: "本の詳細データと読書ステータス",
      control: false,
    },
    Title: {
      description: "ダイアログのタイトルコンポーネント",
      control: false,
    },
    Description: {
      description: "ダイアログの説明コンポーネント",
      control: false,
    },
    status: {
      description: "現在の読書ステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
    optimisticStatus: {
      description: "オプティミスティック更新用のステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
    onChangeStatus: {
      description: "ステータス変更時のコールバック関数",
      action: "onChangeStatus",
    },
    onChangeOptimisticStatus: {
      description: "オプティミスティックステータス変更時のコールバック関数",
      action: "onChangeOptimisticStatus",
    },
  },
  args: {
    Title: DialogTitle,
    Description: DialogDescription,
    status: "reading",
    optimisticStatus: "reading",
  },
  render: (args) => (
    <Dialog>
      <BookDetailContent {...args} />
    </Dialog>
  ),
};

export default meta;
type Story = StoryObj<typeof BookDetailContent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的な本の詳細情報表示。本のカバー画像、タイトル、著者、出版社、概要が表示され、読書ステータス変更フォームも統合されています。",
      },
    },
  },
  args: {
    data: {
      detail: createDummyBookDetail("1234567890"),
      readingStatus: "reading",
    },
  },
};

export const MultipleValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "複数の著者や出版社がある場合の表示。複数の値がカンマ区切りで適切に表示されることを確認できます。",
      },
    },
  },
  args: {
    data: {
      detail: {
        ...createDummyBookDetail("1234567890"),
        authors: ["author1", "author2"],
        publishers: ["publisher1", "publisher2"],
      },
      readingStatus: "reading",
    },
  },
};

export const WithoutAuthor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "著者情報がない場合の表示。著者欄が適切に非表示またはフォールバック表示されることを確認できます。",
      },
    },
  },
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

export const WithoutPublisher: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "出版社情報がない場合の表示。出版社欄が適切に非表示またはフォールバック表示されることを確認できます。",
      },
    },
  },
  args: {
    data: {
      detail: {
        ...createDummyBookDetail("1234567890"),
        publishers: undefined,
      },
      readingStatus: "reading",
    },
  },
};
