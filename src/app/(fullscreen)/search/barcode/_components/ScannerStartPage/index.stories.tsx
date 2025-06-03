import type { Meta, StoryObj } from "@storybook/react";
import ScannerStartPage from ".";

const meta: Meta<typeof ScannerStartPage> = {
  title: "Pages/Search/Barcode/ScannerStartPage",
  component: ScannerStartPage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScannerStartPage>;

export const Default: Story = {};
