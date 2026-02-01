"use client";

import type { CSSProperties } from "react";
import { type ExternalToast, Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { twMerge } from "tailwind-merge";

export type ToastProps = {
  id: string | number;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  emoji?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type ToastInput = Omit<ToastProps, "id">;

function CustomToast(props: ToastProps) {
  const { title, description, emoji, type = "info", action, id } = props;

  const getBorderColor = () => {
    switch (type) {
      case "error":
        return "border-red-400/50";
      default:
        return "border-tertiary-border";
    }
  };

  return (
    <div
      className={twMerge(
        "flex w-full items-center rounded-2xl border-2 bg-primary-background px-6 py-4 shadow-lg lg:min-w-72",
        getBorderColor(),
      )}
    >
      {emoji && <div className="mr-4 border-secondary-border border-r pr-4 text-xl">{emoji}</div>}
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="font-medium text-base/5 text-primary-foreground">{title}</p>
          {description && <p className="mt-1 text-secondary-foreground text-xs">{description}</p>}
        </div>
      </div>
      {action && (
        <div className="ml-6 shrink-0">
          <button
            className="cursor-pointer rounded-full bg-accent px-3 py-2 font-medium text-primary-background text-sm transition-colors hover:bg-accent/90"
            onClick={() => {
              action.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * スタイルを当てたtoast
 */
export function toast(toastProps: ToastInput, external?: ExternalToast) {
  return sonnerToast.custom(
    (id) => (
      <CustomToast
        id={id}
        title={toastProps.title}
        description={toastProps.description}
        type={toastProps.type}
        emoji={toastProps.emoji}
        action={toastProps.action}
      />
    ),
    external,
  );
}

toast.success = (title: string, options?: Omit<ToastInput, "title" | "type">, external?: ExternalToast) => {
  return toast(
    {
      title,
      type: "success",
      ...options,
    },
    external,
  );
};

toast.error = (title: string, options?: Omit<ToastInput, "title" | "type">, external?: ExternalToast) => {
  return toast(
    {
      title,
      type: "error",
      ...options,
    },
    external,
  );
};

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      style={
        {
          "--width": "400px",
        } as CSSProperties
      }
    />
  );
}
