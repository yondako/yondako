import type { Meta, StoryObj } from "@storybook/react";
import SearchForm from ".";

const meta: Meta<typeof SearchForm> = {
  title: "Search/SearchForm",
  component: SearchForm,
  render: () => {
    return (
      <div className="max-w-md space-y-4">
        <SearchForm />
        <SearchForm />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
