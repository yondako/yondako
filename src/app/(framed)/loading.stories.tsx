import type { Meta, StoryObj } from "@storybook/nextjs";
import NewsLoading from "./news/loading";
import GoodbyeLoading from "./settings/goodbye/loading";
import SettingsLoading from "./settings/loading";

const meta = {
  title: "Pages/Loading",
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="min-h-svh px-6 py-8 lg:px-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const News: Story = { render: () => <NewsLoading /> };
export const Settings: Story = { render: () => <SettingsLoading /> };
export const Goodbye: Story = { render: () => <GoodbyeLoading /> };
