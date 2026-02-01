import type { Meta, StoryObj } from "@storybook/react";
import BookLinks from "./BookLinks";

const meta: Meta<typeof BookLinks> = {
  title: "Components/BookDetail/BookLinks",
  component: BookLinks,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookLinks>;

export const Default: Story = {
  args: {
    title: "サンプルタイトル",
    isbn: "9784253142366",
    ndlLink: "https://example.com/",
  },
};
