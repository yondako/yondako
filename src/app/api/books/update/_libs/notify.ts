type NotifyUpdateResultOpts = {
  updatedBookIds: string[];
  unupdatedBookIds: string[];
  webhookUrl: string;
};

/**
 * 更新結果をSlackに通知する
 * @param updatedBooksCount 更新書籍数
 * @param unupdatedBooksCount 未更新書籍数
 */
export async function notifyUpdateResult({
  updatedBookIds,
  unupdatedBookIds,
  webhookUrl,
}: NotifyUpdateResultOpts) {
  const updatedStatus =
    updatedBookIds.length > 0 ? `\`${updatedBookIds.join(", ")}\`` : "なし";

  const unupdatedStatus =
    unupdatedBookIds.length > 0 ? `\`${unupdatedBookIds.join(", ")}\`` : "なし";

  const text = `新刊書誌データの更新確認が完了

*🆙 更新済み*
${updatedStatus}

*📚️ 未更新*
${unupdatedStatus}
`;

  const payload = {
    text,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("更新結果の通知に失敗", error);
  }
}
