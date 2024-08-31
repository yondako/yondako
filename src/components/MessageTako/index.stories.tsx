import type { Meta, StoryObj } from "@storybook/react";
import MessageTako from ".";

const meta: Meta<typeof MessageTako> = {
  title: "Common/MessageTako",
  component: MessageTako,
};

export default meta;
type Story = StoryObj<typeof MessageTako>;

export const Default: Story = {
  args: {
    title: "タイトル",
    decoration: <span className="-right-2 absolute top-0 text-5xl">🔧</span>,
    children: <p className="mt-3">メッセージをここに入れる</p>,
  },
};
