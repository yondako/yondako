import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";
import LibraryLoading from "./library/[status]/loading";
import NewsLoading from "./news/loading";
import SearchLoading from "./search/loading";
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

export const LibraryWantRead: Story = {
  render: () => <LibraryLoading />,
  parameters: { nextjs: { navigation: { segments: [["status", "want_read"]] } } },
};

export const LibraryReading: Story = {
  render: () => <LibraryLoading />,
  parameters: { nextjs: { navigation: { segments: [["status", "reading"]] } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("ライブラリを読み込み中");
    await expect(canvas.getByRole("link", { name: "よんでる" })).toHaveClass("bg-accent");
    await expect(canvasElement.querySelectorAll("[inert] .animate-pulse")).toHaveLength(9);
  },
};

export const LibraryRead: Story = {
  render: () => <LibraryLoading />,
  parameters: { nextjs: { navigation: { segments: [["status", "read"]] } } },
};

export const Search: Story = { render: () => <SearchLoading /> };
export const News: Story = { render: () => <NewsLoading /> };
export const Settings: Story = { render: () => <SettingsLoading /> };
export const Goodbye: Story = { render: () => <GoodbyeLoading /> };
