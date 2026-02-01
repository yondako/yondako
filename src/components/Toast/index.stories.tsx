import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import Toaster, { type ToastInput, toast } from "./index";

const ToastDemo = ({ title, description, type, emoji, action }: ToastInput) => {
  useEffect(() => {
    toast({ title, description, type, emoji, action }, { duration: Number.POSITIVE_INFINITY });
  }, [title, description, type, emoji, action]);

  return <Toaster />;
};

const meta: Meta<typeof ToastDemo> = {
  title: "Components/Toast",
  component: ToastDemo,
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
    emoji: {
      control: "text",
      description: "絵文字（オプション）",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {
  args: {
    title: "通知",
    description: "これはトースト通知の例です。",
    type: "info",
  },
};

export const Success: Story = {
  args: {
    title: "保存完了",
    description: "データが正常に保存されました。",
    type: "success",
  },
};

export const WithError: Story = {
  args: {
    title: "エラー",
    description: "処理中にエラーが発生しました。もう一度お試しください。",
    type: "error",
  },
};

export const WithAction: Story = {
  args: {
    title: "新しい更新があります",
    description: "アプリケーションの新しいバージョンが利用可能です。",
    type: "info",
    action: {
      label: "実行",
      onClick: () => {},
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
};

export const WithoutDescription: Story = {
  args: {
    title: "簡潔な通知",
    description: undefined,
    type: "info",
  },
};

export const WithEmoji: Story = {
  args: {
    emoji: "📚",
    title: "登録しました",
    description: "リストに追加しました",
    type: "success",
  },
};
