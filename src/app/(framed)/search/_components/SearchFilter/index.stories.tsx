import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NDCList } from "@/types/ndc";
import SearchFilter from ".";

const meta: Meta<typeof SearchFilter> = {
  title: "Pages/Search/SearchFilter",
  component: SearchFilter,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/search",
      },
    },
  },
  argTypes: {
    children: {
      description: "フィルターを開くトリガー要素",
      control: false,
    },
    ndc: {
      description: "現在選択されているNDCカテゴリー",
      control: "text",
    },
    sensitive: {
      description: "センシティブコンテンツフィルタの状態",
      control: "boolean",
    },
    query: {
      description: "現在の検索クエリ",
      control: "text",
    },
  },
  args: {
    children: <button>Open Filter</button>,
    ndc: "",
    sensitive: false,
    query: "example",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // モーダルを開く
    await userEvent.click(canvas.getByRole("button", { name: /open filter/i }));
  },
};

export default meta;
type Story = StoryObj<typeof SearchFilter>;

export const Desktop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "デスクトップ表示での検索フィルター。モーダルダイアログとして表示され、NDCカテゴリー選択とセンシティブコンテンツフィルタリングが可能です。",
      },
    },
    viewport: {
      defaultViewport: "ipad12p",
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "モバイル表示での検索フィルター。ボトムシートドロワーとして表示され、タッチ操作に最適化されたレイアウトで検索フィルターを設定できます。",
      },
    },
    viewport: {
      defaultViewport: "iphone14",
    },
  },
};

export const closeReset: Story = {
  name: "キャンセルしたら状態がリセットされる",
  parameters: {
    docs: {
      description: {
        story:
          "フィルターモーダルで変更を加えた後、キャンセルボタンで閉じると変更が破棄され、元の状態にリセットされることをテストします。",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole("button", { name: /open filter/i });

    await step("モーダルを開く", async () => {
      await userEvent.click(openButton);
    });

    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // biome-ignore lint/style/noNonNullAssertion: createPortalで作成された要素はparentElement内に存在する
    const modalCanvas = within(canvasElement.parentElement!);

    await step("カテゴリーを選択", async () => {
      const categoryRadio = modalCanvas.getByRole("radio", {
        name: NDCList[1].label,
      });

      await userEvent.click(categoryRadio);
    });

    await step("閉じる", async () => {
      await userEvent.click(modalCanvas.getByTestId("button-close"));

      // モーダルが閉じるのを待つ
      await waitFor(() => {
        expect(modalCanvas.queryByRole("radio", { name: NDCList[1].label })).toBeNull();
      });
    });

    await step("もう一度開く", async () => {
      await userEvent.click(openButton);
    });

    await step("リセットされている", async () => {
      const selectedCategory = modalCanvas.getByRole("radio", {
        name: NDCList[0].label,
      });

      expect(selectedCategory).toBeChecked();
    });
  },
};
