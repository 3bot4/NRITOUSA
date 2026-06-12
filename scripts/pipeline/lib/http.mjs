/**
 * Tiny fetch helpers for the daily market pipeline. No dependencies — relies on
 * the global fetch in Node 18+. Every request is bounded by a timeout and sends
 * a browser-ish User-Agent (some free EOD hosts 404/403 a blank UA).
 */

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch text with an AbortController timeout. Retries transient failures
 * (HTTP 429/5xx and network/timeout errors) with exponential backoff — these
 * free EOD hosts rate-limit datacenter IPs (e.g. GitHub Actions) intermittently.
 * Throws on a non-retryable status or after the last attempt.
 */
export async function fetchText(
  url,
  { timeoutMs = 12_000, headers = {}, retries = 2, backoffMs = 800 } = {}
) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(backoffMs * 2 ** (attempt - 1));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: "follow",
        headers: { "User-Agent": UA, Accept: "*/*", ...headers },
      });
      if (!res.ok) {
        const retryable = res.status === 429 || res.status >= 500;
        const err = new Error(`HTTP ${res.status} for ${url}`);
        if (retryable && attempt < retries) {
          lastErr = err;
          continue;
        }
        throw err;
      }
      return await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt >= retries) throw err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

/** Fetch + JSON.parse with the same guarantees. */
export async function fetchJson(url, opts) {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 120)}`);
  }
}

/**
 * Try each async factory in order; return the first that resolves to a finite
 * number. Collects errors so the caller can log why every attempt failed.
 */
export async function firstOk(attempts) {
  const errors = [];
  for (const attempt of attempts) {
    try {
      const out = await attempt.run();
      if (out && Number.isFinite(out.value)) return out;
      errors.push(`${attempt.name}: returned non-finite value`);
    } catch (err) {
      errors.push(`${attempt.name}: ${err.message}`);
    }
  }
  const e = new Error(`all sources failed → ${errors.join(" | ")}`);
  e.attempts = errors;
  throw e;
}
