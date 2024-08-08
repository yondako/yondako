import type { Meta, StoryObj } from "@storybook/react";
import ExternalLink from ".";

const meta: Meta<typeof ExternalLink> = {
  component: ExternalLink,
};

export default meta;
type Story = StoryObj<typeof ExternalLink>;

export const Default: Story = {
  args: {
    href: "https://example.com/",
    children: "リンクテキスト",
  },
};
