import { SITE_URL } from "@/lib/site";

export const INDEXNOW_KEY = "945fef2416ac724594597edd74fb70aa";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const REQUEST_TIMEOUT_MS = 5000;

const isSubmissionEnabled = (): boolean => process.env.VERCEL_ENV === "production";

export const submitToIndexNow = async (urls: readonly string[]): Promise<boolean> => {
  if (!isSubmissionEnabled() || urls.length === 0) return false;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) console.error(`IndexNow responded with ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error("IndexNow submission failed", error);
    return false;
  }
};
