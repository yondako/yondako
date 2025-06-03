import { createDummyBookDetail } from "@/_mocks/book";
import type { ReadingStatus } from "@/types/readingStatus";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { updateReadingStatus } from "#src/actions/updateReadingStatus.mock";
import BookReadingStatusForm from ".";

const mockNdlBibId = "1234567890";

const meta: Meta<typeof BookReadingStatusForm> = {
  title: "Components/BookReadingStatusForm",
  component: BookReadingStatusForm,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    identifiers: {
      description: "本の識別子（NDL書誌ID、ISBN）",
      control: false,
    },
    bookTitle: {
      description: "本のタイトル",
      control: "text",
    },
    status: {
      description: "現在の読書ステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
    optimisticStatus: {
      description: "オプティミスティック更新用のステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
    onChangeStatus: {
      description: "ステータス変更時のコールバック関数",
      action: "onChangeStatus",
    },
    onChangeOptimisticStatus: {
      description: "オプティミスティックステータス変更時のコールバック関数",
      action: "onChangeOptimisticStatus",
    },
    compact: {
      description: "コンパクト表示モード",
      control: "boolean",
    },
  },
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
};

export default meta;
type Story = StoryObj<typeof BookReadingStatusForm>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "通常サイズとコンパクトサイズの両方の表示パターン。コンパクトモードではボタンが小さく表示され、狭いスペースでの使用に適しています。",
      },
    },
  },
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
    docs: {
      description: {
        story:
          "ステータス変更が成功した場合のフロー。クリック後にオプティミスティック更新が実行され、サーバーからのレスポンス後に実際の状態が更新されます。",
      },
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
    docs: {
      description: {
        story:
          "ステータス変更が失敗した場合のフロー。オプティミスティック更新後にエラーが発生した場合、元の状態にロールバックされます。",
      },
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
