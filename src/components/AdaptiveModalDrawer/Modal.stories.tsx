import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Modal from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/AdaptiveModalDrawer/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    open: {
      description: "モーダルの開閉状態",
      control: "boolean",
    },
    onOpenChange: {
      description: "モーダルの開閉状態が変更された時のコールバック関数",
      action: "onOpenChange",
    },
    children: {
      description: "モーダル内に表示するコンテンツ",
      control: false,
    },
    triggerChildren: {
      description: "モーダルを開くトリガーとなる要素",
      control: false,
    },
  },
  args: {
    children: () => <p data-testid="content">モーダルです！</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なモーダルの表示状態。デフォルトで開いた状態で表示されます。",
      },
    },
  },
  args: {
    open: true,
  },
};

export const OpenClose: Story = {
  name: "ダイアログの開閉",
  parameters: {
    docs: {
      description: {
        story:
          "ボタンクリックでモーダルを開き、閉じるボタンで閉じる操作をテストするストーリー。実際のユーザーインタラクションをシミュレートします。",
      },
    },
  },
  args: {
    open: false,
    triggerChildren: <button>Open Dialog</button>,
  },
  play: async ({ canvasElement, step }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: createPortalで作成された要素はparentElement内に存在する
    const canvas = within(canvasElement.parentElement!);

    await step("ダイアログが開く", async () => {
      const button = canvas.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => expect(canvas.getByTestId("content")).toHaveTextContent("モーダルです！"));
    });

    await step("ダイアログが閉じる", async () => {
      const closeButton = canvas.getByTestId("button-close");
      await userEvent.click(closeButton);

      await waitFor(() => expect(canvas.getByTestId("content")).not.toBeVisible());
    });
  },
};
