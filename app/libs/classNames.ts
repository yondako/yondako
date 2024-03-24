/**
 * 複数のclassNameを結合する
 * @param classnames 対象
 * @returns 結合後
 */
export const classNames = (...classnames: (string | boolean | undefined)[]) => {
  return classnames
    .filter<string>((c): c is string => typeof c === "string")
    .join(" ");
};
