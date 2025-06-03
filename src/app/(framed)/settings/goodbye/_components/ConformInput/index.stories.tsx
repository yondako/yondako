import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { goodbyeUser } from "#src/actions/goodbyeUser.mock";
import ConformInput from ".";

const meta: Meta<typeof ConformInput> = {
  title: "Pages/Settings/ConformInput",
  component: ConformInput,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConformInput>;

export const Default: Story = {};

export const SubmitSuccess: Story = {
  name: "ステータスの送信に成功",
  beforeEach: async () => {
    goodbyeUser.mockResolvedValue({
      success: true,
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // alartをモックする
    window.alert = fn();

    await userEvent.type(canvas.getByRole("textbox"), "アカウントを削除");
    await userEvent.click(canvas.getByRole("button"));

    expect(window.alert).toHaveBeenCalledWith("👋 アカウントを削除しました");
  },
};

export const ValidationError: Story = {
  name: "入力値が正しくない場合",
  beforeEach: async () => {
    goodbyeUser.mockResolvedValue({
      success: false,
      error: "入力された文章が違います。正しく入力してください",
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "アカウントを削除");
    await userEvent.click(canvas.getByRole("button"));

    await canvas.findByText("入力された文章が違います。正しく入力してください");
  },
};
