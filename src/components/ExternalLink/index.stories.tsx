import type { Meta, StoryObj } from "@storybook/react";
import ExternalLink from ".";

const meta: Meta<typeof ExternalLink> = {
  title: "Components/ExternalLink",
  component: ExternalLink,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    href: {
      description: "リンク先URL",
      control: { type: "text" },
    },
    children: {
      description: "リンクテキスト",
      control: { type: "text" },
    },
    className: {
      description: "追加のCSSクラス",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExternalLink>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ExternalLinkの基本表示とホバー状態。外部リンクアイコンが表示されます。",
      },
    },
    pseudo: {
      hover: ["#hover"],
    },
  },
  args: {
    href: "https://example.com/",
    children: "リンクテキスト",
  },
  render: (args) => {
    return (
      <>
        <ExternalLink {...args} />
        <ExternalLink {...args} id="hover" />
      </>
    );
  },
};
