import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import ShareDropdownMenu from "./ShareDropdownMenu";

const meta: Meta<typeof ShareDropdownMenu> = {
  title: "Components/BookCard/ShareDropdownMenu",
  component: ShareDropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    ndlUrl: {
      control: "text",
      description: "共有するURL",
    },
    bookTitle: {
      control: "text",
      description: "共有するコンテンツのタイトル",
    },
  },
  args: {
    ndlUrl: "https://ndlsearch.ndl.go.jp/books/R100000002-I030179672",
    bookTitle: "上伊那ぼたん、酔へる姿は百合の花",
  },
  render: (args) => {
    return (
      <div className="p-20">
        <ShareDropdownMenu {...args}>
          <button
            className="h-4 w-4 rounded-2xl text-secondary-foreground transition-opacity hover:opacity-70"
            aria-label="共有メニューを開く"
          >
            <IconDotsVertical className="h-4 w-4" />
          </button>
        </ShareDropdownMenu>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof ShareDropdownMenu>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "書籍カードの共有メニュー。リンクのコピーや共有機能を提供します。",
      },
    },
  },
};

export const Open: Story = {
  name: "メニューを開く",
  parameters: {
    docs: {
      description: {
        story: "アイコンをクリックしてドロップダウンメニューを開く動作をテストします。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const canvas = within(canvasElement.parentElement!);

    const trigger = canvas.getByRole("button", { name: "共有メニューを開く" });
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(canvas.getByText("リンクをコピー")).toBeInTheDocument();
      expect(canvas.getByText("その他の方法で共有")).toBeInTheDocument();
    });
  },
};

export const ClickMenuItem: Story = {
  name: "メニュー項目をクリック",
  parameters: {
    docs: {
      description: {
        story: "メニュー項目をクリックするとメニューが閉じることを確認します。",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const canvas = within(canvasElement.parentElement!);

    await step("メニューを開く", async () => {
      const trigger = canvas.getByRole("button", { name: "共有メニューを開く" });
      await userEvent.click(trigger);
    });

    await step("メニュー項目をクリック", async () => {
      const copyLink = canvas.getByText("リンクをコピー");
      await userEvent.click(copyLink);

      // メニューが閉じることを確認
      await waitFor(() => {
        expect(canvas.queryByText("リンクをコピー")).not.toBeInTheDocument();
      });
    });
  },
};
