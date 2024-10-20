import type { Meta, StoryObj } from "@storybook/react";
import NewsCard from ".";

const meta: Meta<typeof NewsCard> = {
  title: "News/NewsCard",
  component: NewsCard,
  render: (arg) => {
    return (
      <div className="max-w-md space-y-4">
        <NewsCard {...arg} />
        <NewsCard {...arg} title="hover" />
      </div>
    );
  },
  parameters: {
    pseudo: {
      hover: ["[aria-label='hoverの詳細を見る']"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewsCard>;

export const All: Story = {
  args: {
    slug: "slug",
    title: "タイトル",
    emoji: "📚",
    tags: ["タグ1", "タグ2"],
    publishedAt: "2021/01/01",
  },
};
