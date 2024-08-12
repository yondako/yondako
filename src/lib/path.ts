/**
 * ログインページへのパスを生成する
 * @param callbackUrl ログイン後にリダイレクトするURL
 * @returns ログインページへのパス
 */
export const createSignInPath = (callbackUrl: string) =>
  `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
