import type { Meta, StoryObj } from "@storybook/react";
import FormLink from ".";

const meta: Meta<typeof FormLink> = {
  title: "App/Framed/Settings/FormLink",
  component: FormLink,
};

export default meta;
type Story = StoryObj<typeof FormLink>;

export const Default: Story = {
  args: {
    href: "https://example.com",
    title: "タイトル",
    description: "ここに説明文を入れる",
  },
  render: (args) => (
    <div className="p-4">
      <FormLink {...args} />
    </div>
  ),
};
