import type { Meta, StoryObj } from "@storybook/react";
import GenreSelect from "./GenreSelect";

const meta: Meta<typeof GenreSelect> = {
  title: "Search/GenreSelect",
  component: GenreSelect,
  parameters: {
    pseudo: {
      focus: ["#focus"],
    },
  },
  render: (args) => (
    <div className="flex gap-4">
      <GenreSelect {...args} />
      <GenreSelect {...args} id="focus" />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof GenreSelect>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
