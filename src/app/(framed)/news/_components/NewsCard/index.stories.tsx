import type { Meta, StoryObj } from "@storybook/react";
import NewsCard from ".";

const meta: Meta<typeof NewsCard> = {
  title: "News/NewsCard",
  component: NewsCard,
};

export default meta;
type Story = StoryObj<typeof NewsCard>;

export const Default: Story = {
  args: {
    slug: "slug",
    title: "タイトル",
    emoji: "📚",
    tags: ["タグ1", "タグ2"],
    publishedAt: "2021/01/01 00:00",
  },
};
