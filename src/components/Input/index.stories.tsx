import type { Meta, StoryObj } from "@storybook/react";
import Input from ".";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    pseudo: {
      focus: ["#focus"],
    },
  },
  argTypes: {
    search: {
      description: "検索フィールドとして表示するかどうか",
      control: { type: "boolean" },
    },
    placeholder: {
      description: "プレースホルダーテキスト",
    },
    value: {
      description: "入力値",
    },
  },
  render: (args) => {
    return (
      <div className="max-w-96 space-y-6">
        <Input {...args} />
        <Input {...args} placeholder="プレースホルダー" />
        <Input {...args} value="テキスト" />
        <Input {...args} value="テキスト" id="focus" />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "通常のテキスト入力フィールドの表示例。プレースホルダー、入力値、フォーカス状態を含みます。",
      },
    },
  },
  args: {
    search: false,
  },
};

export const Search: Story = {
  parameters: {
    docs: {
      description: {
        story: "検索フィールドとしての表示例。検索アイコンが表示されます。",
      },
    },
  },
  args: {
    search: true,
  },
};
