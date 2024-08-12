import type { Meta, StoryObj } from "@storybook/react";
import Footer from ".";

const meta: Meta<typeof Footer> = {
  title: "Navigation/Footer",
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const Portrait: Story = {
  args: {
    portrait: true,
  },
};
