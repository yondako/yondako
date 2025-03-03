import { NDCList } from "@/types/ndc";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import SearchFilter from ".";

const meta: Meta<typeof SearchFilter> = {
  title: "SearchFilter/SearchFilter",
  component: SearchFilter,
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
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/search",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchFilter>;

export const Desktop: Story = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "ipad12p",
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone14",
    },
  },
};

export const closeReset: Story = {
  name: "キャンセルしたら状態がリセットされる",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole("button", { name: /open filter/i });

    await step("モーダルを開く", async () => {
      await userEvent.click(openButton);
    });

    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
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
        expect(
          modalCanvas.queryByRole("radio", { name: NDCList[1].label }),
        ).toBeNull();
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
