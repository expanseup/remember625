import { cookies } from "next/headers";
import { verifySignedToken } from "@/lib/tokens";

export const ADMIN_COOKIE = "remember625_admin";

export async function hasAdminSession() {
  const store = await cookies();
  return Boolean(verifySignedToken(store.get(ADMIN_COOKIE)?.value, "admin"));
}
