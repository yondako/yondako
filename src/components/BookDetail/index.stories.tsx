import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { createDummyBookDetail } from "#src/_mocks/book";
import BookDetail from ".";

const meta: Meta<typeof BookDetail> = {
  title: "Common/BookDetail",
  component: BookDetail,
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
  args: {
    open: true,
    bookDetailProps: {
      data: {
        detail: {
          ...createDummyBookDetail("1234567890"),
          jpeCode: undefined,
          isbn: undefined,
        },
        readingStatus: "reading",
      },
      status: "reading",
      onChangeStatus: fn(),
      optimisticStatus: "reading",
      onChangeOptimisticStatus: fn(),
    },
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookDetail>;

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "ipad12p",
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone14",
    },
  },
};
