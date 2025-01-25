type NotifyUpdateResultOpts = {
  updatedBooksCount: number;
  unupdatedBooksCount: number;
  webhookUrl: string;
};

/**
 * 更新結果をSlackに通知する
 * @param updatedBooksCount 更新書籍数
 * @param unupdatedBooksCount 未更新書籍数
 */
export async function notifyUpdateResult({
  updatedBooksCount,
  unupdatedBooksCount,
  webhookUrl,
}: NotifyUpdateResultOpts) {
  const text = `新刊書誌データの更新確認が完了しました

- 更新済み: ${updatedBooksCount} 件
- 未更新: ${unupdatedBooksCount} 件`;

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
