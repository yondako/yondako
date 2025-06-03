import type { Meta, StoryObj } from "@storybook/react";
import SearchForm from ".";

const meta: Meta<typeof SearchForm> = {
  title: "Pages/Search/SearchForm",
  component: SearchForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "書籍検索用のフォームコンポーネント。キーワード入力と検索実行機能を提供し、フィルタリング機能も統合しています。URLパラメータと同期して検索状態を管理します。",
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    sensitive: {
      description: "センシティブコンテンツのフィルタリング状態",
      control: "boolean",
    },
  },
  render: () => {
    return (
      <div className="flex max-w-md flex-col gap-2">
        <SearchForm />
        <SearchForm />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的な検索フォームの表示例。キーワード入力フィールド、検索ボタン、フィルターボタンが表示されます。",
      },
    },
  },
};
export const WithFiltered: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "センシティブコンテンツフィルタが有効な状態の検索フォーム。フィルターボタンにアクティブな状態が表示されます。",
      },
    },
  },
  args: {
    sensitive: true,
  },
};
