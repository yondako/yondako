import { expect, mock, test } from "bun:test";
import { useSpring } from "@react-spring/web";
import { render } from "@testing-library/react";
import { useLayoutEffect } from "react";
import { ModalStateProvider } from "@/contexts/ModalStateContext";

mock.module("next/navigation", () => ({ useRouter: () => ({ push: mock() }) }));

let readSpring: () => { x: number; opacity: number };
const actualUseSpring = useSpring;
mock.module("@react-spring/web", () => ({
  useSpring: (initialize: () => { x: number; opacity: number }) => {
    const result = actualUseSpring(initialize);
    const [values] = result;
    readSpring = () => ({ x: values.x.get(), opacity: values.opacity.get() });
    return result;
  },
}));

test.each(["Left", "Right"])("%sへのスワイプ遷移は初回描画前にスケルトンを隠す", async (direction) => {
  const { SwipeableTabView } = await import(".");
  sessionStorage.setItem("swipeTransition", JSON.stringify({ direction, targetStatus: "all" }));
  let valuesBeforePaint: { x: number; opacity: number } | undefined;

  function Page() {
    useLayoutEffect(() => {
      valuesBeforePaint = readSpring();
    }, []);

    return (
      <ModalStateProvider>
        <SwipeableTabView currentStatus="all">
          <p>スケルトン</p>
        </SwipeableTabView>
      </ModalStateProvider>
    );
  }

  render(<Page />);

  const initialX = window.innerWidth * (direction === "Left" ? 0.2 : -0.2);
  expect(valuesBeforePaint).toEqual({ x: initialX, opacity: 0 });
  expect(sessionStorage.getItem("swipeTransition")).toBeNull();
});
