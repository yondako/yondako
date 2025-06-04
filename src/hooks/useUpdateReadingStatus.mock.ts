import { fn } from "storybook/test";

export const mockUpdateReadingStatusWithCache = fn().mockName("updateReadingStatusWithCache");

export const useUpdateReadingStatus = fn(() => ({
  updateReadingStatusWithCache: mockUpdateReadingStatusWithCache,
})).mockName("useUpdateReadingStatus");
