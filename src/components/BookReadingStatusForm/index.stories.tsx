import { createDummyBookDetail } from "@/_mocks/book";
import type { ReadingStatus } from "@/types/readingStatus";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { updateReadingStatus } from "#src/actions/updateReadingStatus.mock";
import BookReadingStatusForm from ".";

const mockNdlBibId = "1234567890";

const meta: Meta<typeof BookReadingStatusForm> = {
  title: "Common/BookReadingStatusForm",
  component: BookReadingStatusForm,
  args: {
    identifiers: {
      ndlBibId: mockNdlBibId,
      isbn: "9784047133450",
    },
    bookTitle: "title",
    status: "want_read" as ReadingStatus,
    optimisticStatus: "want_read" as ReadingStatus,
    onChangeStatus: fn(),
    onChangeOptimisticStatus: fn(),
  },
  beforeEach: async () => {
    updateReadingStatus.mockResolvedValue({
      book: {
        detail: createDummyBookDetail(mockNdlBibId),
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
