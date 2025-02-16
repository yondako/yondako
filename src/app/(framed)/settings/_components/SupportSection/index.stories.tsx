import type { Meta, StoryObj } from "@storybook/react";
import SupportSection from ".";

const meta: Meta<typeof SupportSection> = {
  title: "App/Framed/Settings/SupportSection",
  component: SupportSection,
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
