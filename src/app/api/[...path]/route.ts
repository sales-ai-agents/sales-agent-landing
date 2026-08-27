import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.calls4u.ai";
const SKIP_HEADERS = new Set(["host", "connection", "keep-alive", "transfer-encoding"]);

async function handler(req: NextRequest) {
  const url = new URL(
    req.nextUrl.pathname.replace(/^\/api/, "/webhook") + req.nextUrl.search,
    API_URL
  );

  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (!SKIP_HEADERS.has(k)) headers.set(k, v);
  });

  const session = (await cookies()).get("cs_session");
  if (session) headers.set("cookie", `cs_session=${session.value}`);

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error — duplex required for streaming request bodies
    duplex: "half",
    redirect: "manual",
  });

  const resHeaders = new Headers();
  res.headers.forEach((v, k) => {
    if (!SKIP_HEADERS.has(k)) resHeaders.append(k, v);
  });

  return new NextResponse(res.body, { status: res.status, headers: resHeaders });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
