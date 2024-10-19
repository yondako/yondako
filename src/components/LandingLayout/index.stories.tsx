import type { Meta, StoryObj } from "@storybook/react";
import LandingLayout from ".";

const meta: Meta<typeof LandingLayout> = {
  title: "Common/LandingLayout",
  component: LandingLayout,
};

export default meta;
type Story = StoryObj<typeof LandingLayout>;

export const Default: Story = {};
