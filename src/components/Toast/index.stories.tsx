import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";
import Toaster, { toast } from "./index";

// Toastコンポーネント用の制御ボタンを作成
const ToastDemo = ({
  title,
  description,
  type,
  hasAction,
}: {
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  hasAction?: boolean;
}) => {
  const handleShowToast = () => {
    if (hasAction) {
      toast({
        title,
        description,
        type,
        action: {
          label: "実行",
          onClick: () => {
            console.log("アクションがクリックされました");
          },
        },
      });
    } else {
      toast({ title, description, type });
    }
  };

  const handleSuccess = () => {
    toast.success("成功しました", { description });
  };

  const handleError = () => {
    toast.error("エラーが発生しました", { description });
  };

  return (
    <div className="space-y-4">
      <Toaster />
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handleShowToast}
        data-testid="show-toast"
      >
        トーストを表示
      </button>

      <div className="space-x-2">
        <button
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          onClick={handleSuccess}
          data-testid="success-toast"
        >
          成功トースト
        </button>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={handleError}
          data-testid="error-toast"
        >
          エラートースト
        </button>
      </div>
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "Components/Toast",
  component: ToastDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "カスタムスタイルのトースト通知コンポーネント。成功、エラー、情報の各タイプとアクションボタンをサポートします。",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "トーストのタイトル",
    },
    description: {
      control: "text",
      description: "トーストの説明文（オプション）",
    },
    type: {
      control: { type: "select" },
      options: ["success", "error", "info"],
      description: "トーストのタイプ",
    },
    hasAction: {
      control: "boolean",
      description: "アクションボタンを表示するか",
    },
  },
  args: {
    title: "通知",
    description: "これはトースト通知の例です。",
    type: "info",
    hasAction: false,
  },
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なトースト通知。タイトルと説明文を表示します。",
      },
    },
  },
};

export const Success: Story = {
  args: {
    title: "保存完了",
    description: "データが正常に保存されました。",
    type: "success",
  },
  parameters: {
    docs: {
      description: {
        story: "成功を示すトースト。緑色のスタイルで表示されます。",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    title: "エラー",
    description: "処理中にエラーが発生しました。もう一度お試しください。",
    type: "error",
  },
  parameters: {
    docs: {
      description: {
        story: "エラーを示すトースト。赤いボーダーで強調表示されます。",
      },
    },
  },
};

export const WithAction: Story = {
  args: {
    title: "新しい更新があります",
    description: "アプリケーションの新しいバージョンが利用可能です。",
    type: "info",
    hasAction: true,
  },
  parameters: {
    docs: {
      description: {
        story: "アクションボタン付きのトースト。ユーザーがアクションを実行できます。",
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    title: "これは非常に長いタイトルでトーストの表示がどのようになるかをテストするためのものです",
    description:
      "これは非常に長い説明文です。複数行にわたってテキストが表示される場合のレイアウトを確認するために使用されます。トーストが適切に表示されることを確認してください。",
    type: "info",
  },
  parameters: {
    docs: {
      description: {
        story: "長いタイトルと説明文を持つトースト。レイアウトが適切に処理されることを確認します。",
      },
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "簡潔な通知",
    description: undefined,
    type: "info",
  },
  parameters: {
    docs: {
      description: {
        story: "説明文なしのトースト。タイトルのみが表示されます。",
      },
    },
  },
};

export const SuccessMethod: Story = {
  name: "Success メソッド",
  parameters: {
    docs: {
      description: {
        story: "toast.success() メソッドを使用した成功トースト。より簡潔に成功通知を表示できます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const successButton = canvas.getByTestId("success-toast");
    await userEvent.click(successButton);
  },
};

export const ErrorMethod: Story = {
  name: "Error メソッド",
  parameters: {
    docs: {
      description: {
        story: "toast.error() メソッドを使用したエラートースト。より簡潔にエラー通知を表示できます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorButton = canvas.getByTestId("error-toast");
    await userEvent.click(errorButton);
  },
};

export const Interactive: Story = {
  name: "インタラクティブデモ",
  args: {
    title: "インタラクティブトースト",
    description: "ボタンをクリックしてトーストを表示してください。",
    type: "info",
    hasAction: true,
  },
  parameters: {
    docs: {
      description: {
        story: "実際にボタンをクリックしてトーストの動作を確認できます。アクション付きのトーストも試せます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showButton = canvas.getByTestId("show-toast");
    await userEvent.click(showButton);
  },
};
