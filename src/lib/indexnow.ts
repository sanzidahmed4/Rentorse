/**
 * Reusable server-side helper for IndexNow protocol
 * Submits URL changes to search engines (Bing, Yandex, Naver, Seznam, etc.)
 */

export const INDEXNOW_HOST = "rentorce.com";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Returns the public canonical URL for an apartment listing
 * Reuses existing project pattern: https://rentorce.com/apartments/[slug-or-id]
 */
export function getApartmentPublicUrl(apt: {
  slug?: string;
  _id?: string | { toString(): string };
  id?: string;
}): string {
  const slugOrId =
    apt.slug ||
    (typeof apt._id === "object" && apt._id !== null
      ? apt._id.toString()
      : (apt._id as string | undefined)) ||
    apt.id ||
    "";

  return `https://${INDEXNOW_HOST}/apartments/${slugOrId}`;
}

/**
 * Submits one or multiple URLs to the IndexNow API.
 * Never exposes or logs the API key.
 * Non-blocking: will not throw or reject to avoid affecting primary DB operations.
 */
export async function submitToIndexNow(urls: string | string[]): Promise<boolean> {
  try {
    const rawList = Array.isArray(urls) ? urls : [urls];
    // Filter and deduplicate valid URLs
    const urlList = Array.from(new Set(rawList.map((u) => u.trim()))).filter(
      (u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://"))
    );

    if (urlList.length === 0) {
      return false;
    }

    const key = process.env.INDEXNOW_KEY || "4d8787d56e6a498fa69ea4ab9c475895";
    const keyLocation = `https://${INDEXNOW_HOST}/${key}.txt`;

    const payload = {
      host: INDEXNOW_HOST,
      key,
      keyLocation,
      urlList,
    };

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // 200 = OK, 202 = Accepted (key validation pending)
    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Successfully notified for ${urlList.length} URL(s). (Status: ${res.status})`);
      return true;
    } else {
      const errText = await res.text().catch(() => "");
      console.warn(`[IndexNow] Submission responded with status ${res.status}: ${errText}`);
      return false;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[IndexNow] Network or execution error during submission:", message);
    return false;
  }
}

/**
 * Helper to submit an apartment's public URL directly from an apartment object
 */
export async function submitApartmentUrlToIndexNow(apt: {
  slug?: string;
  _id?: string | { toString(): string };
  id?: string;
}): Promise<boolean> {
  const url = getApartmentPublicUrl(apt);
  return submitToIndexNow(url);
}
