const CAMERA_KEY = "yondako:barcode-camera";

export function rememberCamera(deviceId: string) {
  try {
    if (deviceId) localStorage.setItem(CAMERA_KEY, deviceId);
    else localStorage.removeItem(CAMERA_KEY);
  } catch {
    // 保存できないブラウザでも、今回のカメラ選択は利用できるようにする。
  }
}

export async function selectCamera(
  manualId: string,
  signal: AbortSignal,
  media: Pick<MediaDevices, "getUserMedia" | "enumerateDevices"> = navigator.mediaDevices,
) {
  let savedId = "";
  try {
    savedId = localStorage.getItem(CAMERA_KEY) ?? "";
  } catch {
    // ストレージが使えない場合は毎回自動選択する。
  }

  const inspect = async (deviceId: string) => {
    signal.throwIfAborted();
    const stream = await media.getUserMedia({
      audio: false,
      video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { exact: "environment" } },
    });
    try {
      signal.throwIfAborted();
      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error("カメラの映像トラックがありません");
      const settings = track.getSettings();
      const capabilities = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { focusMode?: string[] };
      return {
        deviceId: settings.deviceId ?? deviceId,
        rear: settings.facingMode === "environment" || capabilities.facingMode?.includes("environment") === true,
        autofocus: capabilities.focusMode?.includes("continuous") === true,
        label: track.label,
      };
    } finally {
      // 複数カメラの同時利用ができない端末でも次の候補を開けるよう、必ず解放する。
      for (const track of stream.getTracks()) track.stop();
    }
  };

  if (manualId || savedId) {
    try {
      const selected = await inspect(manualId || savedId);
      return { ...selected, reason: manualId ? "手動選択" : "前回の選択を復元" };
    } catch (error) {
      signal.throwIfAborted();
      if (manualId || !["NotFoundError", "OverconstrainedError", "NotReadableError"].includes((error as Error).name)) {
        throw error;
      }
      rememberCamera("");
    }
  }

  const fallback = await inspect("");
  if (fallback.rear && fallback.autofocus) return { ...fallback, reason: "既定の背面カメラが連続 AF に対応" };
  let devices: MediaDeviceInfo[];
  try {
    devices = await media.enumerateDevices();
  } catch {
    signal.throwIfAborted();
    return { ...fallback, reason: "カメラ一覧を取得できないため既定カメラを使用" };
  }
  for (const device of devices) {
    if (device.kind !== "videoinput" || !device.deviceId || device.deviceId === fallback.deviceId) continue;
    try {
      const candidate = await inspect(device.deviceId);
      if (candidate.rear && candidate.autofocus) return { ...candidate, reason: "連続 AF 対応の背面カメラを自動選択" };
    } catch (error) {
      signal.throwIfAborted();
      if (["NotAllowedError", "SecurityError"].includes((error as Error).name)) throw error;
    }
  }
  signal.throwIfAborted();
  return { ...fallback, reason: "連続 AF 対応の背面カメラを確認できないため既定カメラを使用" };
}

export async function enableContinuousAutofocus(track: MediaStreamTrack) {
  const capabilities = track.getCapabilities?.() as (MediaTrackCapabilities & { focusMode?: string[] }) | undefined;
  if (!capabilities?.focusMode?.includes("continuous")) return;
  try {
    await track.applyConstraints({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] });
  } catch (error) {
    // AF の設定を受け付けない端末でも、既定の設定で読み取れる可能性を残す。
    console.warn("AutofocusError", error);
  }
}
