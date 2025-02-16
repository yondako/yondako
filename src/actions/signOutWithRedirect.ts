"use server";
import { signOut } from "@/lib/auth";

export const signOutWithRedirect = async () => {
  await signOut({ redirectTo: "/" });
};
