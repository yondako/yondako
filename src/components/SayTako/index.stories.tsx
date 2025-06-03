import type { Meta, StoryObj } from "@storybook/react";
import SayTako from ".";

const meta: Meta<typeof SayTako> = {
  title: "Components/SayTako",
  component: SayTako,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    message: {
      description: "タコが言うメッセージ",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SayTako>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なSayTakoの表示例。タコキャラクターが吹き出しでメッセージを言います。",
      },
    },
  },
  args: {
    message: "メッセージ",
  },
};
