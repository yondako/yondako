import type { Meta, StoryObj } from "@storybook/react";
import NewsCard from ".";

const meta: Meta<typeof NewsCard> = {
  title: "Pages/News/NewsCard",
  component: NewsCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ニュース記事を表示するカードコンポーネント。タイトル、絵文字、タグ、公開日を表示し、クリックで詳細ページへリンクします。",
      },
    },
    pseudo: {
      hover: ["[aria-label='hoverの詳細を見る']"],
    },
  },
  argTypes: {
    slug: {
      description: "ニュース記事のURLスラッグ",
      control: "text",
    },
    title: {
      description: "ニュース記事のタイトル",
      control: "text",
    },
    emoji: {
      description: "ニュース記事の絵文字",
      control: "text",
    },
    tags: {
      description: "ニュース記事のタグ一覧",
      control: "object",
    },
    publishedAt: {
      description: "公開日",
      control: "text",
    },
  },
  render: (arg) => {
    return (
      <div className="max-w-md space-y-4">
        <NewsCard {...arg} />
        <NewsCard {...arg} title="hover" />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof NewsCard>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なニュースカードの表示例。タイトル、絵文字、タグ、公開日が表示され、ホバー状態も確認できます。",
      },
    },
  },
  args: {
    slug: "slug",
    title: "タイトル",
    emoji: "📚",
    tags: ["タグ1", "タグ2"],
    publishedAt: "2021/01/01",
  },
};
