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

export const WithInteraction: Story = {
  name: "フィルターを適用できる",
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    // モーダルを開く
    await userEvent.click(canvas.getByRole("button", { name: /open filter/i }));

    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const modalCanvas = within(canvasElement.parentElement!);

    // カテゴリーを選択
    const categoryRadio = modalCanvas.getByRole("radio", {
      name: NDCList[1].label,
    });
    await userEvent.click(categoryRadio);

    // トグルを切り替える
    const sensitiveSwitch = modalCanvas.getByRole("switch");
    await userEvent.click(sensitiveSwitch);

    const closeButton = modalCanvas.getByRole("link", { name: /絞り込む/i });

    await step("選択内容がURLに反映されている", async () => {
      await waitFor(() =>
        expect(closeButton).toHaveAttribute(
          "href",
          expect.stringContaining(`q=${args.query}`),
        ),
      );

      await waitFor(() =>
        expect(closeButton).toHaveAttribute(
          "href",
          expect.stringContaining(`ndc=${NDCList[1].value}`),
        ),
      );

      await waitFor(() =>
        expect(closeButton).toHaveAttribute(
          "href",
          expect.stringContaining("sensitive=true"),
        ),
      );
    });

    await step("絞り込むボタンでモーダルが閉じる", async () => {
      await userEvent.click(closeButton);

      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: /open filter/i }),
        ).toBeVisible(),
      );
    });
  },
};
