import type { Meta, StoryObj } from "@storybook/react";
import { LoginLoadingPresentational } from "./index";

const meta: Meta<typeof LoginLoadingPresentational> = {
  title: "App/LoginLoading",
  component: LoginLoadingPresentational,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LoginLoadingPresentational>;

export const Default: Story = {
  beforeEach: () => {},
  render: () => <LoginLoadingPresentational />,
};
