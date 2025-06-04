"use client";

import type { CSSProperties } from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { twMerge } from "tailwind-merge";

export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ToastInput = Omit<ToastProps, "id">;

function CustomToast(props: ToastProps) {
  const { title, description, type = "info", action, id } = props;

  const getBorderColor = () => {
    switch (type) {
      case "error":
        return "border border-red-600/80";
      default:
        return "border border-accent/50";
    }
  };

  return (
    <div
      className={twMerge(
        "flex w-full items-center rounded-2xl bg-secondary-background px-6 py-4 shadow-lg",
        getBorderColor(),
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="font-bold font-medium text-base text-primary-foreground">{title}</p>
          {description && <p className="mt-1 text-secondary-foreground text-xs">{description}</p>}
        </div>
      </div>
      {action && (
        <div className="ml-4 shrink-0">
          <button
            className="cursor-pointer rounded-xl bg-accent px-3 py-2 font-medium text-primary-background text-sm transition-colors hover:bg-accent/90"
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
export function toast(toastProps: ToastInput) {
  return sonnerToast.custom((id) => (
    <CustomToast
      id={id}
      title={toastProps.title}
      description={toastProps.description}
      type={toastProps.type}
      action={toastProps.action}
    />
  ));
}

toast.success = (title: string, options?: Omit<ToastInput, "title" | "type">) => {
  return toast({
    title,
    type: "success",
    ...options,
  });
};

toast.error = (title: string, options?: Omit<ToastInput, "title" | "type">) => {
  return toast({
    title,
    type: "error",
    ...options,
  });
};

toast.info = (title: string, options?: Omit<ToastInput, "title" | "type">) => {
  return toast({
    title,
    type: "info",
    ...options,
  });
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
