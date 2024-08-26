import type { Meta, StoryObj } from "@storybook/react";
import SearchError from ".";

const meta: Meta<typeof SearchError> = {
  title: "Search/SearchError",
  component: SearchError,
};

export default meta;
type Story = StoryObj<typeof SearchError>;

export const Default: Story = {
  args: {
    title: "エラータイトル",
    decoration: <span className="-right-2 absolute top-0 text-5xl">🔧</span>,
    children: <p className="mt-3">エラーメッセージをここに入れる</p>,
  },
};
