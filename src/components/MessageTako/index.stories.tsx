import type { Meta, StoryObj } from "@storybook/react";
import MessageTako from ".";

const meta: Meta<typeof MessageTako> = {
  title: "Components/MessageTako",
  component: MessageTako,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    title: {
      description: "メッセージのタイトル",
      control: { type: "text" },
    },
    children: {
      description: "メッセージの内容",
      control: false,
    },
    decoration: {
      description: "装飾要素。アイコンや絵文字などを配置できます",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MessageTako>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なMessageTakoの表示例。タイトル、メッセージ、装飾アイコンが表示されます。",
      },
    },
  },
  args: {
    title: "タイトル",
    decoration: <span className="-right-2 absolute top-0 text-5xl">🔧</span>,
    children: <p className="mt-3">メッセージをここに入れる</p>,
  },
};
