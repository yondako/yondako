import type { Meta, StoryObj } from "@storybook/react";
import BookThumbnail from ".";

const meta: Meta<typeof BookThumbnail> = {
  title: "Components/BookThumbnail",
  component: BookThumbnail,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    thumbnailUrl: {
      description: "サムネイル画像のURL",
      control: { type: "text" },
    },
    className: {
      description: "追加のCSSクラス",
    },
  },
  args: {
    thumbnailUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2470/9784798142470.jpg",
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
        story: "基本的なBookThumbnailの表示例。サムネイル画像URLから書籍のサムネイルを表示します。",
      },
    },
  },
};

export const WithoutThumbnail: Story = {
  parameters: {
    docs: {
      description: {
        story: "サムネイルURLが指定されていない場合のプレースホルダー画像表示例。",
      },
    },
  },
  args: {
    thumbnailUrl: undefined,
  },
};
