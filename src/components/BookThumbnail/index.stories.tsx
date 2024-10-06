import type { Meta, StoryObj } from "@storybook/react";
import BookThumbnail from ".";

const meta: Meta<typeof BookThumbnail> = {
  title: "Common/BookThumbnail",
  component: (props) => {
    return <BookThumbnail {...props} className="w-32" />;
  },
};

export default meta;
type Story = StoryObj<typeof BookThumbnail>;

export const Default: Story = {
  args: {
    isbn: "9784297141738",
  },
};

export const WithBoth: Story = {
  args: {
    isbn: "9784253142366",
    jpeCode: "25314236004733001000",
  },
};

export const NoImage: Story = {
  args: {},
};
