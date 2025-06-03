import type { Meta, StoryObj } from "@storybook/react";
import MessagePage from ".";

const meta: Meta<typeof MessagePage> = {
  title: "Pages/Search/Barcode/MessagePage",
  component: MessagePage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MessagePage>;

export const Default: Story = {};
