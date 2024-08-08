import type { Meta, StoryObj } from "@storybook/react";
import ErrorPage from ".";

const meta: Meta<typeof ErrorPage> = {
  title: "Layout/ErrorPage",
  component: ErrorPage,
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {
  args: {
    title: "エラータイトル",
    children: <p>ここにテキストを入れる</p>,
  },
};
