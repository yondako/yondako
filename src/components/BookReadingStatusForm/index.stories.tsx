import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { createDummyBookDetail } from "#src/_mocks/book";
import { updateReadingStatus } from "#src/actions/updateReadingStatus.mock";
import type { ReadingStatus } from "#src/types/readingStatus";
import BookReadingStatusForm from ".";

const mockBookId = "1234567890";

const meta: Meta<typeof BookReadingStatusForm> = {
  title: "Common/BookReadingStatusForm",
  component: BookReadingStatusForm,
  args: {
    bookId: mockBookId,
    bookTitle: "title",
    status: "want_read" as ReadingStatus,
    optimisticStatus: "want_read" as ReadingStatus,
    onChangeStatus: fn(),
    onChangeOptimisticStatus: fn(),
  },
  beforeEach: async () => {
    updateReadingStatus.mockResolvedValue({
      book: {
        detail: createDummyBookDetail(mockBookId),
        readingStatus: "reading",
      },
    });
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookReadingStatusForm>;

export const All: Story = {
  render: (args) => {
    return (
      <>
        <p>Normal</p>
        <BookReadingStatusForm {...args} />
        <p className="mt-4">Compact</p>
        <BookReadingStatusForm {...args} compact />
      </>
    );
  },
};

export const SubmitSuccess: Story = {
  name: "ステータスの送信に成功",
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("button-status-reading"));

    await step("クリックしたら読書中になる", async () => {
      await waitFor(() =>
        expect(args.onChangeOptimisticStatus).toHaveBeenCalledWith("reading"),
      );
    });

    await step("レスポンスが正常なら状態に反映される", async () => {
      await waitFor(() =>
        expect(args.onChangeStatus).toHaveBeenCalledWith("reading"),
      );
    });
  },
};

export const SubmitError: Story = {
  name: "ステータスの送信に失敗",
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  beforeEach: async () => {
    updateReadingStatus.mockResolvedValue({
      error: "error",
    });
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("button-status-reading"));

    await step("クリックしたら読書中になる", async () => {
      await waitFor(() =>
        expect(args.onChangeOptimisticStatus).toHaveBeenCalledWith("reading"),
      );
    });

    await step("レスポンスがエラーなら状態が戻る", async () => {
      await waitFor(() => expect(args.onChangeStatus).not.toHaveBeenCalled());
      await waitFor(() =>
        expect(args.onChangeOptimisticStatus).toHaveBeenCalledWith("want_read"),
      );
    });
  },
};
