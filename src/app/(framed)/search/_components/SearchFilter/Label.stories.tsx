import * as Dialog from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react";
import Label from "./Label";

const meta: Meta<typeof Label> = {
  title: "SearchFilter/Label",
  component: Label,
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

export const Default: Story = {};
