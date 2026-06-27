import { createHmac, timingSafeEqual } from "node:crypto";

type TokenPayload = {
  type: "admin" | "letter";
  exp: number;
  letterId?: string;
  sessionId?: string;
};

function secret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "remember625-development-only-secret"
  );
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSignedToken(payload: TokenPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${signature(body)}`;
}

export function verifySignedToken(
  token: string | null | undefined,
  type: TokenPayload["type"],
) {
  if (!token) return null;
  const [body, supplied] = token.split(".");
  if (!body || !supplied) return null;
  const expected = signature(body);
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right))
    return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as TokenPayload;
    if (payload.type !== type || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isValidAdminSecret(value: string) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected)
    return process.env.NODE_ENV !== "production" && value === "dev-admin";
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
