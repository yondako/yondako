import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { Meta, StoryObj } from "@storybook/react";
import BookReadingStatusButton from "./ReadingStatusButton";

const meta: Meta<typeof BookReadingStatusButton> = {
  title: "Components/BookReadingStatusForm/ReadingStatusButton",
  component: BookReadingStatusButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "読書ステータスを表示・変更するためのボタンコンポーネント。選択中のステータスをハイライト表示し、クリックでステータスを変更できます。コンパクトモードもサポートしています。",
      },
    },
    pseudo: {
      hover: ["[data-testid=button-status-want_read]"],
    },
  },
  argTypes: {
    status: {
      description: "ボタンが表す読書ステータス",
      control: "select",
      options: ["want_read", "reading", "read"],
    },
    meta: {
      description: "ステータスのメタデータ（ラベル、アイコン）",
      control: false,
    },
    selected: {
      description: "ボタンが選択状態かどうか",
      control: "boolean",
    },
    compact: {
      description: "コンパクト表示モード",
      control: "boolean",
    },
    disabled: {
      description: "ボタンの無効状態",
      control: "boolean",
    },
    onClick: {
      description: "ボタンクリック時のコールバック関数",
      action: "onClick",
    },
  },
  render: (args) => {
    return (
      <>
        <div className="flex gap-4">
          <BookReadingStatusButton {...args} />
          <BookReadingStatusButton {...args} selected />
        </div>
        <div className="mt-8 flex gap-4">
          <BookReadingStatusButton {...args} compact />
          <BookReadingStatusButton {...args} compact status="want_read" />
          <BookReadingStatusButton {...args} selected compact />
          <BookReadingStatusButton
            {...args}
            selected
            compact
            status="want_read"
          />
        </div>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof BookReadingStatusButton>;

const sampleMeta: ReadingStatusMetadataItem = {
  label: "よみたい",
  IconSolid: IconBookmarks,
  IconFilled: IconBookmarksFilled,
};

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ボタンの各種状態（通常・選択・コンパクト）を一覧で表示。ホバー状態もシミュレートされています。異なるステータスでの表示を確認できます。",
      },
    },
  },
  args: {
    status: "reading",
    meta: sampleMeta,
  },
};
