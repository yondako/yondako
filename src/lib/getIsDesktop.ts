/**
 * スマホかどうか
 * @param headers リクエストヘッダー
 * @return スマホの場合はtrue、デスクトップの場合はfalse
 */
export function getIsDesktop(headers: Headers) {
  return headers.get("X-IS-DESKTOP") === "true";
}
