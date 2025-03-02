import type { Meta, StoryObj } from "@storybook/react";
import SearchForm from ".";

const meta: Meta<typeof SearchForm> = {
  title: "Search/SearchForm",
  component: SearchForm,
  render: () => {
    return (
      <div className="flex max-w-md flex-col gap-2">
        <SearchForm />
        <SearchForm />
      </div>
    );
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {};
export const WithFiltered: Story = {
  args: {
    sensitive: true,
  },
};
