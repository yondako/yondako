import { fn } from "storybook/test";

// NOTE:
// ここで import * as actual from "./updateReadingStatus" とすると
// その先の DB 周辺のモックが必要になるので、あえて import してない
// 型が付かないだけ & DB が絡むテストを Storybook でしたい訳じゃないので…

export const updateReadingStatus = fn().mockName("updateReadingStatus");
