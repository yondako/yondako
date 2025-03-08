import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import Modal from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Common/AdaptiveModalDrawer/Modal",
  component: Modal,
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    children: () => <p data-testid="content">モーダルです！</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
  },
};

export const OpenClose: Story = {
  name: "ダイアログの開閉",
  args: {
    open: false,
    triggerChildren: <button>Open Dialog</button>,
  },
  play: async ({ canvasElement, step }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const canvas = within(canvasElement.parentElement!);

    await step("ダイアログが開く", async () => {
      const button = canvas.getByRole("button");
      await userEvent.click(button);

      await waitFor(() =>
        expect(canvas.getByTestId("content")).toHaveTextContent(
          "モーダルです！",
        ),
      );
    });

    await step("ダイアログが閉じる", async () => {
      const closeButton = canvas.getByTestId("button-close");
      await userEvent.click(closeButton);

      await waitFor(() =>
        expect(canvas.getByTestId("content")).not.toBeVisible(),
      );
    });
  },
};
