import type { Meta, StoryObj } from "@storybook/react";
import ECLinks from "./ECLinks";

const meta: Meta<typeof ECLinks> = {
  title: "Common/BookDetail/ECLinks",
  component: ECLinks,
};

export default meta;
type Story = StoryObj<typeof ECLinks>;

export const Default: Story = {
  args: {
    isbn: "9784253142366",
  },
};
