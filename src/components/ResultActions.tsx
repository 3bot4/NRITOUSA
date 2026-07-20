"use client";

import { useState } from "react";

/**
 * Shared share + download bar for calculator results.
 *
 * - Share buttons (WhatsApp / X / LinkedIn / copy link) share the CURRENT
 *   page URL at click time — calculators that encode their inputs in the
 *   query string (history.replaceState) therefore produce links that reopen
 *   the exact same scenario.
 * - "Download PNG" renders a branded summary card on an offscreen canvas
 *   (dependency-free) and downloads it.
 *
 * Nothing here sends data anywhere; all actions are client-side.
 */

export interface ResultActionRow {
  label: string;
  value: string;
}

function currentUrl(): string {
  return typeof window === "undefined" ? "" : window.location.href;
}

function openShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=540");
}

function drawCard(
  title: string,
  rows: ResultActionRow[],
  footnote: string
): HTMLCanvasElement {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Brand gradient header band
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#1e40f5");
  grad.addColorStop(1, "#10b981");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 96);

  // Logo tile + site name
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(48, 24, 48, 48);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("N", 63, 50);
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText("NRI to USA", 116, 44);
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("nritousa.com", 116, 70);

  // Title (wrap to two lines max)
  ctx.fillStyle = "#0b1120";
  ctx.font = "bold 40px system-ui, -apple-system, sans-serif";
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > W - 96 && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((l, idx) => ctx.fillText(l, 48, 156 + idx * 52));

  // Rows
  const startY = 156 + Math.min(lines.length, 2) * 52 + 28;
  const rowH = Math.min(58, (H - startY - 70) / Math.max(rows.length, 1));
  rows.slice(0, 6).forEach((r, idx) => {
    const y = startY + idx * rowH;
    ctx.fillStyle = "#4b5563";
    ctx.font = "24px system-ui, -apple-system, sans-serif";
    ctx.fillText(r.label, 48, y);
    ctx.fillStyle = "#0b1120";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    const vw = ctx.measureText(r.value).width;
    ctx.fillText(r.value, W - 48 - vw, y);
    ctx.strokeStyle = "rgba(11,17,32,0.08)";
    ctx.beginPath();
    ctx.moveTo(48, y + rowH / 2);
    ctx.lineTo(W - 48, y + rowH / 2);
    ctx.stroke();
  });

  // Footnote
  ctx.fillStyle = "#6b7280";
  ctx.font = "17px system-ui, -apple-system, sans-serif";
  ctx.fillText(footnote.slice(0, 130), 48, H - 36);

  return canvas;
}

const BTN =
  "inline-flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/25 hover:text-ink-900";

export default function ResultActions({
  title,
  shareText,
  rows,
  fileName = "nritousa-results",
  footnote = "Educational estimate only — not financial, tax, or insurance advice. nritousa.com",
}: {
  /** Headline drawn on the downloaded PNG. */
  title: string;
  /** Text prefilled into WhatsApp/X shares (URL is appended). */
  shareText: string;
  /** Key results drawn on the PNG (max 6 shown). */
  rows: ResultActionRow[];
  fileName?: string;
  footnote?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const resultsAsText = () =>
    `${title}\n${rows.map((r) => `• ${r.label}: ${r.value}`).join("\n")}\n${currentUrl()}\n${footnote}`;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(resultsAsText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  // Native share sheet (mobile). Feature-detected at click time.
  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (d: { title?: string; text?: string; url?: string }) => Promise<void>;
    };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, text: shareText, url: currentUrl() });
      } catch {
        /* user cancelled — ignore */
      }
    } else {
      copyLink();
    }
  };

  const downloadPng = () => {
    const canvas = drawCard(title, rows, footnote);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${fileName}.png`;
    a.click();
  };

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
        Share or save this scenario
      </p>
      <p className="mt-1 text-xs text-ink-400">
        The shared link may contain the financial assumptions entered in this
        calculator. Do not share it if you consider those amounts private. Names
        and email addresses are not included.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN}
          onClick={() =>
            openShare(
              `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl()}`)}`
            )
          }
        >
          WhatsApp
        </button>
        <button
          type="button"
          className={BTN}
          onClick={() =>
            openShare(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl())}`
            )
          }
        >
          X / Twitter
        </button>
        <button
          type="button"
          className={BTN}
          onClick={() =>
            openShare(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl())}`
            )
          }
        >
          LinkedIn
        </button>
        <button type="button" className={BTN} onClick={copyLink}>
          {copied ? "✓ Link copied" : "Copy link"}
        </button>
        <button type="button" className={`${BTN} sm:hidden`} onClick={nativeShare}>
          Share…
        </button>
        <button type="button" className={BTN} onClick={copyText}>
          {copiedText ? "✓ Copied" : "Copy results"}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
