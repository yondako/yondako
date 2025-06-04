import type { Meta, StoryObj } from "@storybook/react";
import SupportSection from ".";

const meta: Meta<typeof SupportSection> = {
  title: "Pages/Settings/SupportSection",
  component: SupportSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SupportSection>;

export const Default: Story = {
  args: {
    userId: "12345",
  },
  render: (args) => (
    <div className="p-4">
      <SupportSection {...args} />
    </div>
  ),
};
