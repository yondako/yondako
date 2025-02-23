"use client";
import { Loading } from "@/components/Loading";
import { animated, useTransition } from "@react-spring/web";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function LoginLoading() {
  const [isShow, setIsShow] = useState(false);
  const { pending } = useFormStatus();

  // NOTE:
  // ログイン処理が始まったらページが遷移するまでローディングを表示したいので
  // pending と別に状態を持っている
  useEffect(() => {
    if (pending) {
      setIsShow(true);
    }
  });

  const transitions = useTransition(isShow, {
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

  const AnimatedLoginLoading = animated(LoginLoadingPresentational);

  return transitions(
    (style, show) => show && <AnimatedLoginLoading style={style} />,
  );
}

export function LoginLoadingPresentational(
  props: ComponentPropsWithoutRef<"div">,
) {
  return (
    <div
      className="fixed inset-0 flex h-svh w-screen items-center justify-center bg-black/40"
      {...props}
    >
      <Loading
        className="h-fit w-48 rounded-lg bg-primary-background p-8"
        title="ログイン中です"
      />
    </div>
  );
}
