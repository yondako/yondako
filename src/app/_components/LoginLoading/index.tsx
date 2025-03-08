"use client";
import { Loading } from "@/components/Loading";
import { animated, useTransition } from "@react-spring/web";

type Props = {
  show: boolean;
};

export default function LoginLoading({ show }: Props) {
  const transitions = useTransition(show, {
    from: {
      opacity: 0,
      backdropFilter: "blur(0px)",
    },
    enter: {
      opacity: 1,
      backdropFilter: "blur(3px)",
    },
    config: {
      mass: 1.1,
      tension: 250,
      friction: 28,
    },
  });

  return transitions(
    (style, show) =>
      show && (
        <animated.div
          className="fixed inset-0 z-10 flex h-svh w-screen items-center justify-center bg-black/40"
          style={style}
        >
          <Loading
            className="h-fit w-48 rounded-lg bg-primary-background p-8"
            title="ログイン中です"
          />
        </animated.div>
      ),
  );
}
