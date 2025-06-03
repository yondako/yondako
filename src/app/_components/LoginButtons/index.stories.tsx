import type { Meta, StoryObj } from "@storybook/react";
import { waitFor } from "@testing-library/dom";
import { expect, userEvent } from "storybook/test";
import LoginButtons from ".";

const meta: Meta<typeof LoginButtons> = {
  title: "Pages/Auth/LoginButtons",
  component: LoginButtons,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    redirectTo: {
      description: "ログイン後のリダイレクト先URL",
      control: "text",
    },
    className: {
      description: "追加のCSSclasses",
      control: "text",
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なログインボタンの表示例。GoogleとGitHubのログインオプションが表示されます。",
      },
    },
  },
};

export const ShowLoginLoading: Story = {
  name: "ログインボタンを押すとローディングが表示される",
  parameters: {
    docs: {
      description: {
        story:
          "ログインボタンをクリックした時のローディング状態をテストします。Googleボタンをクリックするとローディングメッセージが表示されます。",
      },
    },
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Googleで続ける" });
    await userEvent.click(button);

    await waitFor(() => {
      expect(canvas.getByText("ログイン中です")).toBeInTheDocument();
    });
  },
};
