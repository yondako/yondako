import type { Meta, StoryObj } from "@storybook/react";
import Footer from ".";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    portrait: {
      description: "縦向きレイアウトで表示するかどうか",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なFooterの表示例。横向きレイアウトで表示されます。",
      },
    },
  },
};

export const Portrait: Story = {
  parameters: {
    docs: {
      description: {
        story: "縦向きレイアウトでのFooter表示例。",
      },
    },
  },
  args: {
    portrait: true,
  },
};
