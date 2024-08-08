import type { Meta, StoryObj } from "@storybook/react";
import SearchBox from ".";

const meta: Meta<typeof SearchBox> = {
  component: () => {
    return (
      <div className="max-w-96 space-y-4">
        <SearchBox />
        <SearchBox placeholder="プレースホルダー" />
        <SearchBox value="テキスト" />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const All: Story = {};
