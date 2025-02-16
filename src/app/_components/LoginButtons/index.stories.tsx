import type { Meta, StoryObj } from "@storybook/react";
import LoginButtons from ".";

const meta: Meta<typeof LoginButtons> = {
  title: "App/LoginButtons",
  component: LoginButtons,
  argTypes: {
    redirectTo: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoginButtons>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="w-96">
        <LoginButtons {...args} />
      </div>
    );
  },
};
