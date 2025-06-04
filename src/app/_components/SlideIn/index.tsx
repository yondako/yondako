"use client";

import { animated, useInView } from "@react-spring/web";
import type { ComponentPropsWithRef } from "react";

export default function SlideIn({ className, children }: Pick<ComponentPropsWithRef<"div">, "className" | "children">) {
  const [ref, springs] = useInView(
    () => ({
      from: {
        opacity: 0,
        y: 60,
      },
      to: {
        opacity: 1,
        y: 0,
        config: {
          mass: 5,
          tension: 500,
          friction: 200,
        },
      },
    }),
    {
      rootMargin: "-20% 0%",
      once: true,
    },
  );

  return (
    <animated.div ref={ref} className={className} style={springs}>
      {children}
    </animated.div>
  );
}
