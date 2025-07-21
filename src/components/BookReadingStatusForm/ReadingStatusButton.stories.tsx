import type { Meta, StoryObj } from "@storybook/react";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import type { ReadingStatusMetadataItem } from "@/constants/status";
import BookReadingStatusButton from "./ReadingStatusButton";

const meta: Meta<typeof BookReadingStatusButton> = {
  title: "Components/BookReadingStatusForm/ReadingStatusButton",
  component: BookReadingStatusButton,
  tags: ["autodocs"],
  parameters: {
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
          <BookReadingStatusButton {...args} selected compact status="want_read" />
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
