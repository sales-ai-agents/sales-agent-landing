import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.calls4u.ai";
const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-length",
]);
const SKIP_RESPONSE_HEADERS = new Set(["connection", "keep-alive", "transfer-encoding"]);
const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

async function handler(req: NextRequest) {
  const url = new URL(
    req.nextUrl.pathname.replace(/^\/api/, "/webhook") + req.nextUrl.search,
    API_URL
  );

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key)) headers.set(key, value);
  });

  const session = (await cookies()).get("cs_session");
  if (session) headers.set("cookie", `cs_session=${session.value}`);

  const body = METHODS_WITHOUT_BODY.has(req.method) ? undefined : await req.arrayBuffer();
  const hasBody = body !== undefined && body.byteLength > 0;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: req.method,
      headers,
      body: hasBody ? body : undefined,
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "gateway_error",
        message: "Не вдалося з'єднатися з сервером. Спробуйте ще раз.",
      },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!SKIP_RESPONSE_HEADERS.has(key)) responseHeaders.append(key, value);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
