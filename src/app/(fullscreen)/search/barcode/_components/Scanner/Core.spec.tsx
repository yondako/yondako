import { expect, mock, spyOn, test } from "bun:test";
import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import { act, render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import ScannerCore from "./Core";

test("camera restart waits for pending init, keeps detection policy and cleans up", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
  localStorage.removeItem("yondako:barcode-camera");
  const probeStop = mock(() => {});
  const active = {
    getSettings: () => ({ deviceId: "rear-af", facingMode: "environment" }),
    getCapabilities: () => ({ focusMode: ["continuous"], torch: true }),
    applyConstraints: mock(async () => {}),
  } as unknown as MediaStreamTrack;
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: async () => ({
        getVideoTracks: () => [active],
        getTracks: () => [{ stop: probeStop }],
      }),
      enumerateDevices: async () => [{ kind: "videoinput", deviceId: "rear-af", label: "Rear" }],
    },
  });
  const pending: NonNullable<Parameters<typeof Quagga.init>[1]>[] = [];
  const init = spyOn(Quagga, "init").mockImplementation((_config, callback) => {
    if (callback) pending.push(callback);
    // ブラウザ版の void 戻り値でもコールバック完了を待つ仕様を検証する。
    return undefined as unknown as Promise<void>;
  });
  const start = spyOn(Quagga, "start").mockImplementation(async () => {});
  const stop = spyOn(Quagga, "stop").mockImplementation(async () => {});
  const getTrack = spyOn(Quagga.CameraAccess, "getActiveTrack").mockReturnValue(active);
  let detected: ((result: QuaggaJSResultObject) => void) | undefined;
  const on = spyOn(Quagga, "onDetected").mockImplementation((handler) => {
    detected = handler;
  });
  const off = spyOn(Quagga, "offDetected").mockImplementation(() => {});
  const ready = mock(() => {});
  const error = mock(() => {});
  const found = mock(() => {});
  const ref = createRef<HTMLDivElement>();
  const scanner = (deviceId: string) => (
    <div ref={ref}>
      <ScannerCore scannerRef={ref} deviceId={deviceId} onReady={ready} onInitError={error} onDetected={found} />
    </div>
  );
  const view = render(scanner(""));
  try {
    await waitFor(() => expect(pending).toHaveLength(1));
    view.rerender(scanner("rear-af"));
    await act(async () => {
      await Bun.sleep(10);
    });
    expect(pending).toHaveLength(1);
    await act(async () => {
      pending[0](undefined);
    });
    await waitFor(() => expect(pending).toHaveLength(2));
    expect(start).not.toHaveBeenCalled();
    await act(async () => {
      pending[1](undefined);
    });
    await waitFor(() => expect(ready).toHaveBeenCalledTimes(1));
    expect(start).toHaveBeenCalledTimes(1);
    expect(probeStop).toHaveBeenCalledTimes(2);
    expect(active.applyConstraints).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    const result = (value: string) =>
      ({ codeResult: { code: value, decodedCodes: [{ error: 0.1 }] } }) as QuaggaJSResultObject;
    detected?.(result("9784167838386"));
    expect(found).not.toHaveBeenCalled();
    detected?.(result("9784167838386"));
    expect(found).toHaveBeenCalledWith("9784167838386");
    view.rerender(scanner("other"));
    await waitFor(() => expect(pending).toHaveLength(3));
    await act(async () => {
      pending[2](undefined);
    });
    await waitFor(() => expect(ready).toHaveBeenCalledTimes(2));
    found.mockClear();
    detected?.(result("9784167838386"));
    expect(found).not.toHaveBeenCalled();
    view.unmount();
    await act(async () => {
      await Bun.sleep(1);
    });
    expect(stop).toHaveBeenCalled();
    expect(off).toHaveBeenCalled();
  } finally {
    view.unmount();
    for (const spy of [init, start, stop, getTrack, on, off]) spy.mockRestore();
    localStorage.removeItem("yondako:barcode-camera");
    if (descriptor) Object.defineProperty(navigator, "mediaDevices", descriptor);
    else Reflect.deleteProperty(navigator, "mediaDevices");
  }
});
