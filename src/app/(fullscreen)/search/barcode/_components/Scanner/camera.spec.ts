import { expect, spyOn, test } from "bun:test";
import { enableContinuousAutofocus, rememberCamera, selectCamera } from "./camera";

test("camera selection, saved fallback, permission denial and cancellation", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const saved = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
      removeItem: (key: string) => saved.delete(key),
    },
  });
  try {
    const cameras = [
      { id: "rear-fixed", facing: "environment", modes: ["manual"] },
      { id: "front-af", facing: "user", modes: ["continuous"] },
      { id: "rear-af", facing: "environment", modes: ["continuous"] },
    ];
    const opened: string[] = [];
    const stopped: string[] = [];
    let onOpen = () => {};
    const media = {
      enumerateDevices: async () => cameras.map((c) => ({ kind: "videoinput", deviceId: c.id })),
      getUserMedia: async (constraints: MediaStreamConstraints) => {
        const id =
          ((constraints.video as MediaTrackConstraints).deviceId as ConstrainDOMStringParameters)?.exact ??
          cameras[0].id;
        const camera = cameras.find((c) => c.id === id);
        if (!camera) throw new DOMException("gone", "NotFoundError");
        opened.push(camera.id);
        onOpen();
        const track = {
          label: camera.id,
          getSettings: () => ({ deviceId: camera.id, facingMode: camera.facing }),
          getCapabilities: () => ({ focusMode: camera.modes }),
          stop: () => stopped.push(camera.id),
        };
        return { getVideoTracks: () => [track], getTracks: () => [track] };
      },
    } as unknown as Pick<MediaDevices, "getUserMedia" | "enumerateDevices">;
    const choose = (manual = "") => selectCamera(manual, new AbortController().signal, media);

    expect((await choose()).deviceId).toBe("rear-af");
    expect(opened).toEqual(["rear-fixed", "front-af", "rear-af"]);
    expect(stopped).toEqual(opened);

    rememberCamera("rear-fixed");
    opened.length = 0;
    stopped.length = 0;
    expect((await choose()).reason).toBe("前回の選択を復元");
    expect(opened).toEqual(["rear-fixed"]);
    expect((await choose("rear-af")).reason).toBe("手動選択");

    rememberCamera("removed-camera");
    expect((await choose()).deviceId).toBe("rear-af");
    expect(saved.size).toBe(0);
    await expect(choose("removed-camera")).rejects.toHaveProperty("name", "NotFoundError");

    cameras[2].modes = [];
    expect((await choose()).deviceId).toBe("rear-fixed");
    cameras[0].modes = ["continuous"];
    opened.length = 0;
    stopped.length = 0;
    expect((await choose()).deviceId).toBe("rear-fixed");
    expect(opened).toEqual(["rear-fixed"]);

    const controller = new AbortController();
    onOpen = () => controller.abort();
    opened.length = 0;
    stopped.length = 0;
    await expect(selectCamera("", controller.signal, media)).rejects.toHaveProperty("name", "AbortError");
    expect(stopped).toEqual(opened);

    rememberCamera("rear-af");
    const denied = {
      ...media,
      getUserMedia: async () => {
        throw new DOMException("denied", "NotAllowedError");
      },
    };
    await expect(selectCamera("", new AbortController().signal, denied)).rejects.toHaveProperty(
      "name",
      "NotAllowedError",
    );
    expect(saved.get("yondako:barcode-camera")).toBe("rear-af");

    rememberCamera("");
    onOpen = () => {};
    cameras[0].modes = [];
    const noList = {
      ...media,
      enumerateDevices: async () => {
        throw new Error("unavailable");
      },
    };
    expect((await selectCamera("", new AbortController().signal, noList)).deviceId).toBe("rear-fixed");

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get: () => {
        throw new Error("disabled");
      },
    });
    expect(() => rememberCamera("rear-af")).not.toThrow();
    expect((await choose()).deviceId).toBe("rear-fixed");
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("continuous AF is optional and failure preserves scanning", async () => {
  const applied: MediaTrackConstraints[] = [];
  let modes: string[] | undefined;
  const track = {
    getCapabilities: () => ({ focusMode: modes }),
    applyConstraints: async (constraints: MediaTrackConstraints) => {
      applied.push(constraints);
    },
  } as unknown as MediaStreamTrack;
  await enableContinuousAutofocus(track);
  modes = ["manual"];
  await enableContinuousAutofocus(track);
  expect(applied).toHaveLength(0);
  modes = ["continuous"];
  await enableContinuousAutofocus(track);
  expect(applied).toEqual([{ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] }]);
  track.applyConstraints = async () => {
    throw new Error("not supported");
  };
  const warning = spyOn(console, "warn").mockImplementation(() => {});
  try {
    await expect(enableContinuousAutofocus(track)).resolves.toBeUndefined();
  } finally {
    warning.mockRestore();
  }
});
