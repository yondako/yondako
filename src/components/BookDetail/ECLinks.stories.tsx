import type { Meta, StoryObj } from "@storybook/react";
import ECLinks from "./ECLinks";

const meta: Meta<typeof ECLinks> = {
  title: "Components/BookDetail/ECLinks",
  component: ECLinks,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    isbn: {
      description: "書籍のISBN。ECサイトへのリンク生成に使用されます",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ECLinks>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なECLinksの表示例。指定されたISBNに基づいて異なるECサイトへのリンクを表示します。",
      },
    },
  },
  args: {
    isbn: "9784253142366",
  },
};
