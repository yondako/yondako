import type { Meta, StoryObj } from "@storybook/react";
import ErrorMessage from ".";

const meta: Meta<typeof ErrorMessage> = {
  title: "Common/ErrorMessage",
  component: ErrorMessage,
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    title: "エラータイトル",
    decoration: <span className="-right-2 absolute top-0 text-5xl">🔧</span>,
    children: <p className="mt-3">エラーメッセージをここに入れる</p>,
  },
};
