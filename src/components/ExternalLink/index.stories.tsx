import type { Meta, StoryObj } from "@storybook/react";
import ExternalLink from ".";

const meta: Meta<typeof ExternalLink> = {
  title: "Common/ExternalLink",
  component: ExternalLink,
};

export default meta;
type Story = StoryObj<typeof ExternalLink>;

export const All: Story = {
  args: {
    href: "https://example.com/",
    children: "リンクテキスト",
  },
  parameters: {
    pseudo: {
      hover: ["#hover"],
    },
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
