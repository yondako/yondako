"use server";

import { deleteUser } from "#src/db/queries/user";

export type GoodByeUserResult = {
  success: boolean;
  error?: string;
};

export const goodbyeUser = async (
  _prevState: GoodByeUserResult,
  formData: FormData,
): Promise<GoodByeUserResult> => {
  const phrase = formData.get("phrase")?.toString() ?? "";

  if (phrase !== "アカウントを削除") {
    return {
      success: false,
      error: "入力された文章が違います。正しく入力してください",
    };
  }

  const error = await deleteUser();

  return {
    success: typeof error !== "string",
    error,
  };
};
