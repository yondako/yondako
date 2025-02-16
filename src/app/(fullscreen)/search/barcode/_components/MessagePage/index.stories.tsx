import type { Meta, StoryObj } from "@storybook/react";
import MessagePage from ".";

const meta: Meta<typeof MessagePage> = {
  title: "App/Fullscreen/Search/Barcode/MessagePage",
  component: MessagePage,
};

export default meta;
type Story = StoryObj<typeof MessagePage>;

export const Default: Story = {};
