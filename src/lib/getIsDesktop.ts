/**
 * デスクトップかどうか
 * @param headers リクエストヘッダー
 * @return デスクトップの場合はtrue、スマホの場合はfalse
 */
export function getIsDesktop(headers: Headers) {
  return headers.get("X-IS-DESKTOP") === "true";
}
