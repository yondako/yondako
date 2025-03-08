import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "@storybook/test";
import { waitFor } from "@testing-library/dom";
import LoginButtons from ".";

const meta: Meta<typeof LoginButtons> = {
  title: "App/LoginButtons",
  component: LoginButtons,
  argTypes: {
    redirectTo: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  render: (args) => {
    return (
      <div className="w-96">
        <LoginButtons {...args} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof LoginButtons>;

export const Default: Story = {};

export const ShowLoginLoading: Story = {
  name: "ログインボタンを押すとローディングが表示される",
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Googleで続ける" });
    await userEvent.click(button);

    await waitFor(() => {
      expect(canvas.getByText("ログイン中です")).toBeInTheDocument();
    });
  },
};
