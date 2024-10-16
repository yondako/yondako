import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookDetailDialog from "./Dialog";

const meta: Meta<typeof BookDetailDialog> = {
  title: "Common/BookDetail/BookDetailDialog",
  component: BookDetailDialog,
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    bookDetailProps: {
      data: {
        detail: createDummyBookDetail("1234567890"),
        readingStatus: "reading",
      },
      status: "reading",
      onChangeStatus: fn(),
      optimisticStatus: "reading",
      onChangeOptimisticStatus: fn(),
    },
  },
  render: (args) => (
    <BookDetailDialog {...args}>
      <button>Open Dialog</button>
    </BookDetailDialog>
  ),
};

export default meta;
type Story = StoryObj<typeof BookDetailDialog>;

export const Default: Story = {
  args: {
    open: true,
  },
  parameters: {
    chromatic: { delay: 500 },
  },
};

export const OpenClose: Story = {
  name: "ダイアログの開閉",
  args: {
    open: false,
  },
  play: async ({ canvasElement, step, args }) => {
    // NOTE: canvasElement内にcreatePortalで作った要素がない問題のワークアラウンド
    // https://github.com/storybookjs/storybook/issues/16971
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const canvas = within(canvasElement.parentElement!);

    await step("ダイアログが開く", async () => {
      const button = canvas.getByRole("button");
      await userEvent.click(button);

      await waitFor(() =>
        expect(canvas.getByTestId("book-title")).toHaveTextContent(
          args.bookDetailProps.data.detail.title,
        ),
      );
    });

    await step("ダイアログが閉じる", async () => {
      const closeButton = canvas.getByTestId("button-close");
      await userEvent.click(closeButton);

      await waitFor(() =>
        expect(canvas.getByTestId("book-title")).not.toBeVisible(),
      );
    });
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};
