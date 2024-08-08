import type { Meta, StoryObj } from "@storybook/react";
import SayTako from ".";

const meta: Meta<typeof SayTako> = {
  component: SayTako,
};

export default meta;
type Story = StoryObj<typeof SayTako>;

export const Default: Story = {
  args: {
    message: "メッセージ",
  },
};
