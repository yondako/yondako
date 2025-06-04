import * as Dialog from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react";
import Label from "./Label";

const meta: Meta<typeof Label> = {
  title: "Pages/Search/SearchFilter/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    title: {
      description: "ラベルのタイトル",
      control: "text",
    },
    description: {
      description: "ラベルの説明文",
      control: "text",
    },
    Title: {
      description: "タイトルコンポーネント",
      control: false,
    },
    Description: {
      description: "説明コンポーネント",
      control: false,
    },
    className: {
      description: "追加のCSSclasses",
      control: "text",
    },
  },
  args: {
    title: "Sample Title",
    description: "This is a sample description for the label component.",
    className: "",
  },
  render: (args) => (
    <Dialog.Root>
      <Label {...args} Title={Dialog.Title} Description={Dialog.Description} />
    </Dialog.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なフィルターラベルの表示例。タイトルと説明文が適切なスタイルで表示されます。",
      },
    },
  },
};
