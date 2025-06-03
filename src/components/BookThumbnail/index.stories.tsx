import type { Meta, StoryObj } from "@storybook/react";
import BookThumbnail from ".";

const meta: Meta<typeof BookThumbnail> = {
  title: "Components/BookThumbnail",
  component: BookThumbnail,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    isbn: {
      description: "書籍のISBN",
      control: { type: "text" },
    },
    title: {
      description: "書籍のタイトル（alt属性に使用）",
      control: { type: "text" },
    },
    className: {
      description: "追加のCSSクラス",
    },
    priority: {
      description: "画像の読み込み優先度",
      control: { type: "boolean" },
    },
  },
  args: {
    isbn: "9784798142470",
    title: "サンプル書籍",
  },
  render: (args) => {
    return <BookThumbnail {...args} className="w-32" />;
  },
};

export default meta;
type Story = StoryObj<typeof BookThumbnail>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なBookThumbnailの表示例。ISBNから書籍のサムネイル画像を表示します。",
      },
    },
  },
};

export const WithoutISBN: Story = {
  parameters: {
    docs: {
      description: {
        story: "ISBNが指定されていない場合のプレースホルダー画像表示例。",
      },
    },
  },
  args: {
    isbn: undefined,
    title: "ISBNなし書籍",
  },
};
