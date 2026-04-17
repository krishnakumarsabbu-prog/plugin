export function getResultsPanelHtml(scanId?: number | null): string {
  const sid = scanId ?? null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CheckmarkX — Vulnerability Dashboard</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-0: #080c12;
      --bg-1: #0d1117;
      --bg-2: #161b22;
      --bg-3: #1c2333;
      --bg-hover: #1f2a3c;
      --border: #21262d;
      --border-2: #30363d;
      --text-1: #e6edf3;
      --text-2: #8b949e;
      --text-3: #484f58;
      --red: #f85149;
      --red-dim: rgba(248,81,73,0.14);
      --red-border: rgba(248,81,73,0.35);
      --orange: #f0883e;
      --orange-dim: rgba(240,136,62,0.14);
      --orange-border: rgba(240,136,62,0.35);
      --yellow: #e3b341;
      --yellow-dim: rgba(227,179,65,0.14);
      --green: #3fb950;
      --green-dim: rgba(63,185,80,0.14);
      --green-border: rgba(63,185,80,0.35);
      --blue: #388bfd;
      --blue-dim: rgba(56,139,253,0.14);
      --blue-border: rgba(56,139,253,0.35);
      --cyan: #39d0d8;
      --cyan-dim: rgba(57,208,216,0.1);
      --purple: #bc8cff;
      --accent: #388bfd;
      --radius: 8px;
      --radius-sm: 5px;
    }

    html, body {
      background: var(--bg-1);
      color: var(--text-1);
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      font-size: 13px;
      height: 100vh;
      overflow: hidden;
    }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-3); }

    /* ──────────────────────────────────────────────
       LAYOUT
    ────────────────────────────────────────────── */
    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ──────────────────────────────────────────────
       TOP BAR
    ────────────────────────────────────────────── */
    .topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 16px;
      background: var(--bg-2);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .topbar-logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      width: 26px;
      height: 26px;
      background: linear-gradient(135deg, #388bfd 0%, #1f6feb 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-1);
      letter-spacing: -0.3px;
    }

    .logo-text span { color: var(--blue); }

    .scan-id-pill {
      font-size: 11px;
      background: var(--blue-dim);
      color: var(--blue);
      border: 1px solid var(--blue-border);
      border-radius: 20px;
      padding: 2px 10px;
      font-weight: 600;
      letter-spacing: 0.2px;
    }

    .scan-id-pill.loading {
      animation: pulse-border 1.5s ease-in-out infinite;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 600;
    }

    .status-badge.done {
      background: var(--green-dim);
      color: var(--green);
      border: 1px solid var(--green-border);
    }

    .status-badge.loading {
      background: var(--blue-dim);
      color: var(--blue);
      border: 1px solid var(--blue-border);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    .status-dot.pulse { animation: pulse-dot 1.2s ease-in-out infinite; }

    .topbar-spacer { flex: 1; }

    .topbar-actions { display: flex; gap: 6px; align-items: center; }

    .topbar-btn {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      color: var(--text-2);
      padding: 5px 11px;
      cursor: pointer;
      font-size: 12px;
      font-family: inherit;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .topbar-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-dim); }

    /* ──────────────────────────────────────────────
       SUMMARY ROW
    ────────────────────────────────────────────── */
    .summary-row {
      display: flex;
      gap: 8px;
      padding: 10px 16px;
      background: var(--bg-2);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .scard {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }

    .scard::after {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .scard:hover::after { opacity: 1; }
    .scard:hover { filter: brightness(1.12); transform: translateY(-1px); }
    .scard.active { filter: brightness(1.2); transform: translateY(-1px); }

    .scard.total { background: var(--blue-dim); border-color: var(--blue-border); }
    .scard.high  { background: var(--red-dim);  border-color: var(--red-border); }
    .scard.medium{ background: var(--orange-dim);border-color: var(--orange-border); }
    .scard.low   { background: var(--green-dim); border-color: var(--green-border); }
    .scard.info  { background: var(--yellow-dim);border-color: rgba(227,179,65,0.35); }

    .scard-icon {
      font-size: 20px;
      flex-shrink: 0;
      line-height: 1;
    }

    .scard-count {
      font-size: 26px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -1px;
    }

    .scard.total .scard-count { color: var(--blue); }
    .scard.high  .scard-count { color: var(--red); }
    .scard.medium .scard-count{ color: var(--orange); }
    .scard.low   .scard-count { color: var(--green); }
    .scard.info  .scard-count { color: var(--yellow); }

    .scard-label {
      font-size: 10px;
      color: var(--text-2);
      margin-top: 2px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ──────────────────────────────────────────────
       ACTION BAR
    ────────────────────────────────────────────── */
    .action-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--bg-2);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .abtn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .abtn-primary { background: var(--blue); color: #fff; }
    .abtn-primary:hover { background: #1f6feb; }
    .abtn-success { background: var(--green); color: #0a0f14; }
    .abtn-success:hover { background: #2ea043; }
    .abtn-ghost { background: var(--bg-3); color: var(--text-2); border: 1px solid var(--border-2); }
    .abtn-ghost:hover { border-color: var(--blue); color: var(--blue); }

    .search-wrap {
      flex: 1;
      position: relative;
    }

    .search-wrap input {
      width: 100%;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 6px 10px 6px 30px;
      color: var(--text-1);
      font-size: 12px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
    }

    .search-wrap input:focus { border-color: var(--blue); }
    .search-wrap input::placeholder { color: var(--text-3); }

    .search-icon {
      position: absolute;
      left: 9px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-3);
      font-size: 12px;
      pointer-events: none;
    }

    .pill-select {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 6px 10px;
      color: var(--text-2);
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      appearance: none;
    }

    /* ──────────────────────────────────────────────
       BODY SPLIT
    ────────────────────────────────────────────── */
    .body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ──────────────────────────────────────────────
       LEFT: VULN LIST
    ────────────────────────────────────────────── */
    .left-panel {
      width: 340px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      background: var(--bg-1);
      overflow: hidden;
    }

    .left-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-2);
      flex-shrink: 0;
    }

    .left-header-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .left-count {
      font-size: 10px;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 10px;
      padding: 1px 8px;
      color: var(--text-2);
    }

    .vuln-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .vuln-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 10px 12px;
      cursor: pointer;
      transition: all 0.15s;
      border-left: 3px solid transparent;
      animation: slide-in 0.2s ease forwards;
    }

    .vuln-card:hover {
      background: var(--bg-hover);
      border-color: var(--border-2);
    }

    .vuln-card.selected {
      background: var(--bg-hover);
      border-color: var(--blue-border);
      border-left-color: var(--blue);
    }

    .vuln-card.sev-high   { border-left-color: var(--red); }
    .vuln-card.sev-high.selected { border-left-color: var(--red); border-color: var(--red-border); }
    .vuln-card.sev-medium { border-left-color: var(--orange); }
    .vuln-card.sev-medium.selected { border-left-color: var(--orange); border-color: var(--orange-border); }
    .vuln-card.sev-low    { border-left-color: var(--green); }
    .vuln-card.sev-low.selected { border-left-color: var(--green); border-color: var(--green-border); }
    .vuln-card.sev-info   { border-left-color: var(--yellow); }

    .vc-top {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }

    .sev-dot-lg {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .sev-dot-lg.high   { background: var(--red); box-shadow: 0 0 6px rgba(248,81,73,0.5); }
    .sev-dot-lg.medium { background: var(--orange); box-shadow: 0 0 6px rgba(240,136,62,0.5); }
    .sev-dot-lg.low    { background: var(--green); box-shadow: 0 0 6px rgba(63,185,80,0.4); }
    .sev-dot-lg.info   { background: var(--yellow); }

    .vc-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-1);
      line-height: 1.4;
      flex: 1;
    }

    .sev-chip {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      flex-shrink: 0;
    }

    .sev-chip.high   { background: var(--red-dim);    color: var(--red);    border: 1px solid var(--red-border); }
    .sev-chip.medium { background: var(--orange-dim); color: var(--orange); border: 1px solid var(--orange-border); }
    .sev-chip.low    { background: var(--green-dim);  color: var(--green);  border: 1px solid var(--green-border); }
    .sev-chip.info   { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(227,179,65,.35); }

    .vc-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .meta-tag {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      color: var(--text-3);
      background: var(--bg-3);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 1px 6px;
    }

    .meta-tag.cwe {
      color: var(--purple);
      background: rgba(188,140,255,0.1);
      border-color: rgba(188,140,255,0.25);
    }

    .load-more-wrap {
      padding: 10px 8px;
      flex-shrink: 0;
      border-top: 1px solid var(--border);
    }

    .load-more-btn {
      width: 100%;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      color: var(--text-2);
      padding: 7px;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
    }

    .load-more-btn:hover { border-color: var(--blue); color: var(--blue); }
    .load-more-btn:disabled { opacity: 0.4; cursor: default; }

    /* ──────────────────────────────────────────────
       RIGHT: DETAIL PANEL
    ────────────────────────────────────────────── */
    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg-1);
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-3);
      gap: 10px;
      font-size: 13px;
    }

    .empty-icon { font-size: 42px; opacity: 0.4; }

    /* ── Detail scroll area ── */
    .detail-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Section Cards ── */
    .section-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,0.015);
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-2);
    }

    .section-body { padding: 14px; }

    /* ── Vuln Header Card ── */
    .detail-header-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }

    .dh-top {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .dh-sev-badge {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .dh-sev-badge.high   { background: var(--red-dim);    border: 1px solid var(--red-border); }
    .dh-sev-badge.medium { background: var(--orange-dim); border: 1px solid var(--orange-border); }
    .dh-sev-badge.low    { background: var(--green-dim);  border: 1px solid var(--green-border); }
    .dh-sev-badge.info   { background: var(--yellow-dim); border: 1px solid rgba(227,179,65,.35); }

    .dh-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-1);
      line-height: 1.3;
      flex: 1;
    }

    .dh-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      align-items: center;
    }

    .pill {
      font-size: 10px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 20px;
    }

    .pill.sev-high   { background: var(--red-dim);    color: var(--red);    border: 1px solid var(--red-border); }
    .pill.sev-medium { background: var(--orange-dim); color: var(--orange); border: 1px solid var(--orange-border); }
    .pill.sev-low    { background: var(--green-dim);  color: var(--green);  border: 1px solid var(--green-border); }
    .pill.sev-info   { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(227,179,65,.35); }
    .pill.cwe        { background: rgba(188,140,255,0.12); color: var(--purple); border: 1px solid rgba(188,140,255,.3); }
    .pill.scan       { background: var(--blue-dim); color: var(--blue); border: 1px solid var(--blue-border); }

    /* ── Data Flow ── */
    .flow-container {
      padding: 14px;
      overflow-x: auto;
    }

    .flow-track {
      display: flex;
      align-items: stretch;
      gap: 0;
      min-width: max-content;
    }

    .flow-node {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      min-width: 160px;
      max-width: 220px;
      position: relative;
      transition: all 0.15s;
      cursor: default;
    }

    .flow-node:hover {
      border-color: var(--blue-border);
      background: var(--bg-hover);
    }

    .flow-node.source { border-color: var(--red-border); background: var(--red-dim); }
    .flow-node.sink   { border-color: var(--orange-border); background: var(--orange-dim); }
    .flow-node.middle { border-color: var(--border-2); }

    .fn-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .fn-label.source-lbl { color: var(--red); }
    .fn-label.sink-lbl   { color: var(--orange); }
    .fn-label.node-lbl   { color: var(--text-3); }

    .fn-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-1);
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .fn-file {
      font-size: 10px;
      color: var(--text-3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .fn-line {
      font-size: 9px;
      color: var(--blue);
      margin-top: 2px;
    }

    .flow-arrow {
      display: flex;
      align-items: center;
      padding: 0 8px;
      color: var(--text-3);
      font-size: 16px;
      flex-shrink: 0;
      align-self: center;
    }

    .flow-arrow-animated {
      animation: arrow-pulse 1.5s ease-in-out infinite;
    }

    /* ── Code Snippet ── */
    .code-section { padding: 0; }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      border-bottom: 1px solid var(--border);
      background: rgba(0,0,0,0.2);
    }

    .code-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-3);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .code-filename {
      font-size: 11px;
      color: var(--blue);
      font-family: 'Consolas', monospace;
    }

    .code-pre {
      background: var(--bg-0);
      padding: 12px 14px;
      font-family: 'Consolas', 'Cascadia Code', 'SF Mono', monospace;
      font-size: 12px;
      line-height: 1.7;
      overflow-x: auto;
      margin: 0;
      border: none;
    }

    .code-line {
      display: flex;
      gap: 12px;
    }

    .code-line-num {
      color: var(--text-3);
      min-width: 28px;
      text-align: right;
      user-select: none;
      flex-shrink: 0;
    }

    .code-line-text { color: var(--text-1); white-space: pre; }
    .code-line.highlight-line .code-line-text { color: var(--red); }
    .code-line.highlight-line { background: rgba(248,81,73,0.08); margin: 0 -14px; padding: 0 14px; border-left: 2px solid var(--red); }

    /* ── AI Panel ── */
    .ai-panel {
      background: linear-gradient(135deg, rgba(56,139,253,0.06) 0%, rgba(57,208,216,0.04) 100%);
      border: 1px solid var(--blue-border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .ai-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(56,139,253,0.2);
      background: rgba(56,139,253,0.06);
    }

    .ai-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .ai-name {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-1);
    }

    .ai-role {
      font-size: 10px;
      color: var(--blue);
    }

    .ai-body { padding: 14px; }

    .ai-desc {
      font-size: 12px;
      color: var(--text-2);
      line-height: 1.7;
    }

    /* ── Actions Bar ── */
    .detail-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      background: var(--bg-2);
      flex-shrink: 0;
    }

    .daction-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 18px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: all 0.15s;
    }

    .daction-open {
      background: var(--bg-3);
      color: var(--text-1);
      border: 1px solid var(--border-2);
    }

    .daction-open:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-dim); }

    .daction-fix {
      background: var(--green);
      color: #0a0f14;
    }

    .daction-fix:hover { background: #2ea043; }

    .daction-spacer { flex: 1; }

    /* ──────────────────────────────────────────────
       LOADING / SKELETON
    ────────────────────────────────────────────── */
    .loading-overlay {
      position: absolute;
      inset: 0;
      background: var(--bg-1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 100;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border-2);
      border-top-color: var(--blue);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-text {
      font-size: 13px;
      color: var(--text-2);
      font-weight: 500;
    }

    .skeleton {
      background: linear-gradient(90deg, var(--bg-3) 25%, var(--bg-hover) 50%, var(--bg-3) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    /* ──────────────────────────────────────────────
       FOOTER
    ────────────────────────────────────────────── */
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 16px;
      background: var(--bg-2);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    .footer-left { font-size: 10px; color: var(--text-3); display: flex; gap: 12px; }
    .footer-right { display: flex; gap: 8px; }

    .footer-btn {
      padding: 5px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: all 0.15s;
    }

    .footer-btn.primary { background: var(--blue); color: #fff; }
    .footer-btn.primary:hover { background: #1f6feb; }
    .footer-btn.success { background: var(--green); color: #0a0f14; }
    .footer-btn.success:hover { background: #2ea043; }
    .footer-btn.ghost { background: var(--bg-3); color: var(--text-2); border: 1px solid var(--border-2); }
    .footer-btn.ghost:hover { border-color: var(--border-2); color: var(--text-1); }

    /* ──────────────────────────────────────────────
       ANIMATIONS
    ────────────────────────────────────────────── */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    @keyframes fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes pulse-border {
      0%, 100% { box-shadow: 0 0 0 0 rgba(56,139,253,0.3); }
      50% { box-shadow: 0 0 0 4px rgba(56,139,253,0); }
    }

    @keyframes arrow-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .fade-up { animation: fade-up 0.3s ease forwards; }

    /* no results */
    .no-results {
      padding: 32px 16px;
      text-align: center;
      color: var(--text-3);
      font-size: 12px;
    }
  </style>
</head>
<body>
<div class="shell" id="shell">

  <!-- LOADING OVERLAY -->
  <div class="loading-overlay" id="loading-overlay">
    <div class="spinner"></div>
    <div class="loading-text" id="loading-text">Fetching vulnerabilities...</div>
  </div>

  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-logo">
      <div class="logo-icon">&#x1F6E1;</div>
      <span class="logo-text">Checkmar<span>kX</span></span>
    </div>
    <span class="scan-id-pill" id="scan-id-pill">Scan #&mdash;</span>
    <span class="status-badge loading" id="status-badge">
      <span class="status-dot pulse"></span>
      <span id="status-text">Loading</span>
    </span>
    <div class="topbar-spacer"></div>
    <div class="topbar-actions">
      <button class="topbar-btn" onclick="exportReport()">&#x21A5; Export</button>
      <button class="topbar-btn" onclick="newScan()">&#x21A9; New Scan</button>
    </div>
  </div>

  <!-- SUMMARY ROW -->
  <div class="summary-row" id="summary-row">
    <div class="scard total" onclick="filterSev(null)" id="sc-total">
      <span class="scard-icon">&#x2261;</span>
      <div>
        <div class="scard-count" id="cnt-total">&#x2014;</div>
        <div class="scard-label">Total</div>
      </div>
    </div>
    <div class="scard high" onclick="filterSev('HIGH')" id="sc-high">
      <span class="scard-icon">&#x26D4;</span>
      <div>
        <div class="scard-count" id="cnt-high">&#x2014;</div>
        <div class="scard-label">High</div>
      </div>
    </div>
    <div class="scard medium" onclick="filterSev('MEDIUM')" id="sc-medium">
      <span class="scard-icon">&#x26A0;</span>
      <div>
        <div class="scard-count" id="cnt-medium">&#x2014;</div>
        <div class="scard-label">Medium</div>
      </div>
    </div>
    <div class="scard low" onclick="filterSev('LOW')" id="sc-low">
      <span class="scard-icon">&#x2714;</span>
      <div>
        <div class="scard-count" id="cnt-low">&#x2014;</div>
        <div class="scard-label">Low</div>
      </div>
    </div>
    <div class="scard info" onclick="filterSev('INFO')" id="sc-info">
      <span class="scard-icon">&#x2139;</span>
      <div>
        <div class="scard-count" id="cnt-info">&#x2014;</div>
        <div class="scard-label">Info</div>
      </div>
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="action-bar">
    <button class="abtn abtn-primary" onclick="analyzeSelected()">&#x1F50D; Analyze Selected</button>
    <button class="abtn abtn-success" onclick="fixSelected()">&#x26A1; Fix with Copilot</button>
    <div class="search-wrap">
      <span class="search-icon">&#x1F50D;</span>
      <input type="text" id="search-input" placeholder="Search vulnerabilities..." oninput="applyFilters()" />
    </div>
    <select class="pill-select" id="sev-filter" onchange="applyFilters()">
      <option value="">All Severities</option>
      <option value="HIGH">High</option>
      <option value="MEDIUM">Medium</option>
      <option value="LOW">Low</option>
      <option value="INFO">Info</option>
    </select>
    <select class="pill-select" id="sort-select" onchange="applyFilters()">
      <option value="severity">Severity</option>
      <option value="name">Name</option>
      <option value="file">File</option>
      <option value="line">Line</option>
    </select>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- LEFT: VULN LIST -->
    <div class="left-panel">
      <div class="left-header">
        <span class="left-header-title">&#x26A0; Vulnerabilities</span>
        <span class="left-count" id="list-count">0</span>
      </div>
      <div class="vuln-list" id="vuln-list">
        <div class="no-results">Loading results...</div>
      </div>
      <div class="load-more-wrap" id="load-more-wrap" style="display:none;">
        <button class="load-more-btn" id="load-more-btn" onclick="loadMore()">Load More</button>
      </div>
    </div>

    <!-- RIGHT: DETAIL PANEL -->
    <div class="right-panel" id="right-panel">
      <div class="empty-state" id="empty-state">
        <div class="empty-icon">&#x1F6E1;</div>
        <div>Select a vulnerability to view details</div>
      </div>
      <div id="detail-view" style="display:none;flex:1;flex-direction:column;overflow:hidden;">
        <div class="detail-scroll" id="detail-scroll"></div>
        <div class="detail-actions" id="detail-actions"></div>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-left">
      <span id="footer-scan">Scan ID: &mdash;</span>
      <span id="footer-count">0 findings</span>
    </div>
    <div class="footer-right">
      <button class="footer-btn primary" onclick="analyzeAll()">&#x1F50D; Analyze All</button>
      <button class="footer-btn success" onclick="fixAll()">&#x26A1; Fix All</button>
      <button class="footer-btn ghost" onclick="exportReport()">&#x21A5; Export</button>
    </div>
  </div>

</div>

<script>
  const vscode = acquireVsCodeApi();

  /* ─── State ─── */
  let allResults   = [];
  let filtered     = [];
  let selectedIdx  = -1;
  let sevFilter    = null;
  let currentScanId = ${JSON.stringify(sid)};
  let offset       = 0;
  let limit        = 10;
  let hasMore      = false;
  let isFetching   = false;

  const API_BASE = 'http://localhost:8888';

  /* ─── Init ─── */
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'LOAD_RESULTS') {
      if (msg.scanId) currentScanId = msg.scanId;
      if (msg.data) {
        ingestApiResults(msg.data);
        hideLoading();
        return;
      }
    }
    if (msg.type === 'SET_SCAN_ID') {
      currentScanId = msg.scanId;
      startFetch();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    updateScanIdUI();
    if (currentScanId) {
      startFetch();
    } else {
      setStatus('Awaiting scan ID...', 'loading');
    }
  });

  function startFetch() {
    updateScanIdUI();
    offset = 0;
    allResults = [];
    filtered = [];
    setStatus('Fetching...', 'loading');
    showLoading('Fetching vulnerabilities...');
    fetchResults();
  }

  function updateScanIdUI() {
    if (currentScanId) {
      document.getElementById('scan-id-pill').textContent = 'Scan #' + currentScanId;
      document.getElementById('footer-scan').textContent = 'Scan ID: ' + currentScanId;
    }
  }

  async function fetchResults() {
    if (isFetching) return;
    isFetching = true;

    const url = API_BASE + '/cxrestapi/help/sast/results?scanId=' + currentScanId
      + '&offset=' + offset + '&limit=' + limit;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      ingestApiResults(json);
    } catch (e) {
      setStatus('Fetch error — showing demo data', 'loading');
      ingestApiResults(getDemoData());
    } finally {
      isFetching = false;
      hideLoading();
    }
  }

  function ingestApiResults(json) {
    const items = extractResults(json);
    if (offset === 0) {
      allResults = items;
    } else {
      allResults = allResults.concat(items);
    }

    hasMore = items.length >= limit;
    offset += items.length;

    applyFilters();
    updateSummary();
    setStatus('Analysis Complete', 'done');

    const wrap = document.getElementById('load-more-wrap');
    if (hasMore) {
      wrap.style.display = 'block';
      document.getElementById('load-more-btn').disabled = false;
    } else {
      wrap.style.display = 'none';
    }
  }

  function extractResults(json) {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.results)) return json.results;
    if (json && json.data && Array.isArray(json.data)) return json.data;
    if (json && json.vulnerabilities) return json.vulnerabilities;
    return [];
  }

  function loadMore() {
    document.getElementById('load-more-btn').disabled = true;
    fetchResults();
  }

  /* ─── Summary ─── */
  function updateSummary() {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0, total: 0 };
    allResults.forEach(r => {
      counts.total++;
      const s = normSev(r);
      if (counts[s] !== undefined) counts[s]++;
      else counts.INFO++;
    });

    setCount('cnt-total', counts.total);
    setCount('cnt-high',  counts.HIGH);
    setCount('cnt-medium',counts.MEDIUM);
    setCount('cnt-low',   counts.LOW);
    setCount('cnt-info',  counts.INFO);

    document.getElementById('footer-count').textContent = counts.total + ' finding' + (counts.total !== 1 ? 's' : '');
  }

  function setCount(id, n) {
    document.getElementById(id).textContent = n;
  }

  /* ─── Severity helpers ─── */
  function normSev(r) {
    const raw = (r.severity || r.data?.severity || '').toUpperCase();
    if (['CRITICAL','HIGH'].includes(raw)) return 'HIGH';
    if (raw === 'MEDIUM') return 'MEDIUM';
    if (raw === 'LOW') return 'LOW';
    return 'INFO';
  }

  function sevClass(sev) {
    const s = sev.toUpperCase();
    if (s === 'HIGH') return 'high';
    if (s === 'MEDIUM') return 'medium';
    if (s === 'LOW') return 'low';
    return 'info';
  }

  function sevIcon(sev) {
    const s = sev.toUpperCase();
    if (s === 'HIGH') return '&#x26D4;';
    if (s === 'MEDIUM') return '&#x26A0;';
    if (s === 'LOW') return '&#x2705;';
    return '&#x2139;';
  }

  /* ─── Filtering & sorting ─── */
  function filterSev(sev) {
    sevFilter = sev;
    document.getElementById('sev-filter').value = sev || '';
    ['total','high','medium','low','info'].forEach(k => {
      document.getElementById('sc-' + k).classList.remove('active');
    });
    if (!sev) document.getElementById('sc-total').classList.add('active');
    else document.getElementById('sc-' + sev.toLowerCase()).classList.add('active');
    applyFilters();
  }

  function applyFilters() {
    const q = document.getElementById('search-input').value.toLowerCase().trim();
    const sevSel = document.getElementById('sev-filter').value || sevFilter;
    const sort = document.getElementById('sort-select').value;

    filtered = allResults.filter(r => {
      const name = getQueryName(r).toLowerCase();
      const file = getFileName(r).toLowerCase();
      if (q && !name.includes(q) && !file.includes(q)) return false;
      if (sevSel && normSev(r) !== sevSel.toUpperCase()) return false;
      return true;
    });

    const sevOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, INFO: 3 };
    filtered.sort((a, b) => {
      if (sort === 'severity') return (sevOrder[normSev(a)] || 3) - (sevOrder[normSev(b)] || 3);
      if (sort === 'name') return getQueryName(a).localeCompare(getQueryName(b));
      if (sort === 'file') return getFileName(a).localeCompare(getFileName(b));
      if (sort === 'line') return (getLine(a) || 0) - (getLine(b) || 0);
      return 0;
    });

    renderList();

    document.getElementById('list-count').textContent = filtered.length;
  }

  /* ─── Field extractors (handle Checkmarx API shapes) ─── */
  function getQueryName(r) {
    return r.queryName || r.data?.queryName || r.name || r.title || r.type || 'Unknown Vulnerability';
  }

  function getFileName(r) {
    const src = getSourceNode(r);
    if (src) return src.fileName || src.file || '';
    return r.fileName || r.data?.fileName || r.file || '';
  }

  function getLine(r) {
    const src = getSourceNode(r);
    if (src) return src.line || src.lineNumber || 0;
    return r.line || r.data?.line || 0;
  }

  function getCwe(r) {
    return r.cweId || r.data?.cweId || r.cwe || r.vulnerabilityId || '';
  }

  function getDescription(r) {
    return r.resultDescription || r.description || r.data?.description || r.data?.resultDescription || '';
  }

  function getNodes(r) {
    if (r.nodes && Array.isArray(r.nodes)) return r.nodes;
    if (r.data && r.data.nodes && Array.isArray(r.data.nodes)) return r.data.nodes;
    if (r.path && Array.isArray(r.path)) return r.path;
    return [];
  }

  function getSourceNode(r) {
    const nodes = getNodes(r);
    return nodes.length ? nodes[0] : null;
  }

  function getSinkNode(r) {
    const nodes = getNodes(r);
    return nodes.length ? nodes[nodes.length - 1] : null;
  }

  function getCode(node) {
    return node?.code || node?.snippet || node?.sourceCode || node?.line_content || '';
  }

  /* ─── Render list ─── */
  function renderList() {
    const el = document.getElementById('vuln-list');

    if (filtered.length === 0) {
      el.innerHTML = '<div class="no-results">No vulnerabilities match the current filter</div>';
      return;
    }

    el.innerHTML = filtered.map((r, i) => {
      const sev = normSev(r);
      const sc  = sevClass(sev);
      const name = escHtml(getQueryName(r));
      const file = escHtml(shortFile(getFileName(r)));
      const line = getLine(r);
      const cwe  = getCwe(r);
      const isSelected = i === selectedIdx;

      return '<div class="vuln-card sev-' + sc + (isSelected ? ' selected' : '') + '" '
        + 'onclick="selectResult(' + i + ')" '
        + 'style="animation-delay:' + (i * 0.03) + 's">'
        + '<div class="vc-top">'
        +   '<span class="sev-dot-lg ' + sc + '"></span>'
        +   '<span class="vc-name">' + name + '</span>'
        +   '<span class="sev-chip ' + sc + '">' + sev + '</span>'
        + '</div>'
        + '<div class="vc-meta">'
        +   (file ? '<span class="meta-tag">&#x1F4C4; ' + file + '</span>' : '')
        +   (line ? '<span class="meta-tag">&#x21E8; L' + line + '</span>' : '')
        +   (cwe  ? '<span class="meta-tag cwe">CWE-' + cwe + '</span>' : '')
        + '</div>'
        + '</div>';
    }).join('');
  }

  /* ─── Select & render detail ─── */
  function selectResult(i) {
    selectedIdx = i;
    renderList();

    const r = filtered[i];
    if (!r) return;

    document.getElementById('empty-state').style.display = 'none';
    const dv = document.getElementById('detail-view');
    dv.style.display = 'flex';

    renderDetail(r);
  }

  function renderDetail(r) {
    const sev = normSev(r);
    const sc  = sevClass(sev);
    const name = getQueryName(r);
    const cwe  = getCwe(r);
    const desc = getDescription(r);
    const nodes = getNodes(r);
    const src  = getSourceNode(r);
    const sink = getSinkNode(r);
    const srcCode  = getCode(src);
    const sinkCode = getCode(sink);

    const scroll = document.getElementById('detail-scroll');
    scroll.innerHTML = '';
    scroll.className = 'detail-scroll fade-up';

    /* ── Header Card ── */
    const hc = mkEl('div', 'detail-header-card');
    hc.innerHTML = '<div class="dh-top">'
      + '<div class="dh-sev-badge ' + sc + '">' + sevIcon(sev) + '</div>'
      + '<div class="dh-title">' + escHtml(name) + '</div>'
      + '</div>'
      + '<div class="dh-pills">'
      +   '<span class="pill sev-' + sc + '">' + sev + '</span>'
      +   (cwe ? '<span class="pill cwe">CWE-' + escHtml(String(cwe)) + '</span>' : '')
      +   (currentScanId ? '<span class="pill scan">Scan #' + currentScanId + '</span>' : '')
      + '</div>';
    scroll.appendChild(hc);

    /* ── Data Flow ── */
    if (nodes.length > 0) {
      const flowCard = mkEl('div', 'section-card');
      flowCard.innerHTML = '<div class="section-header">'
        + '<span style="font-size:14px;">&#x21C4;</span>'
        + '<span class="section-title">Data Flow</span>'
        + '<span style="font-size:10px;color:var(--text-3);margin-left:auto;">' + nodes.length + ' nodes</span>'
        + '</div>';

      const flowBody = mkEl('div', 'flow-container');
      const track = mkEl('div', 'flow-track');

      nodes.forEach((node, ni) => {
        if (ni > 0) {
          const arr = mkEl('div', 'flow-arrow');
          arr.innerHTML = '<span class="flow-arrow-animated">&#x27A1;</span>';
          track.appendChild(arr);
        }

        const isFirst = ni === 0;
        const isLast  = ni === nodes.length - 1;
        const nodeEl  = mkEl('div', 'flow-node' + (isFirst ? ' source' : isLast ? ' sink' : ' middle'));

        const label   = isFirst ? '<span class="fn-label source-lbl">Source</span>'
          : isLast   ? '<span class="fn-label sink-lbl">Sink</span>'
          : '<span class="fn-label node-lbl">Node ' + (ni + 1) + '</span>';

        const nName = node.name || node.methodName || node.code || ('Node ' + (ni + 1));
        const nFile = shortFile(node.fileName || node.file || '');
        const nLine = node.line || node.lineNumber || '';

        nodeEl.innerHTML = label
          + '<div class="fn-name" title="' + escHtml(nName) + '">' + escHtml(truncate(nName, 28)) + '</div>'
          + (nFile ? '<div class="fn-file" title="' + escHtml(nFile) + '">' + escHtml(nFile) + '</div>' : '')
          + (nLine ? '<div class="fn-line">Line ' + nLine + '</div>' : '');

        track.appendChild(nodeEl);
      });

      flowBody.appendChild(track);
      flowCard.appendChild(flowBody);
      scroll.appendChild(flowCard);
    }

    /* ── Code Snippets ── */
    if (srcCode || sinkCode) {
      const codeCard = mkEl('div', 'section-card');
      codeCard.innerHTML = '<div class="section-header">'
        + '<span style="font-size:14px;">&#x1F4C4;</span>'
        + '<span class="section-title">Code</span>'
        + '</div>';

      if (srcCode && src) {
        codeCard.appendChild(buildCodeBlock(
          'Source',
          shortFile(src.fileName || src.file || ''),
          srcCode,
          src.line || src.lineNumber
        ));
      }

      if (sinkCode && sink && sink !== src) {
        codeCard.appendChild(buildCodeBlock(
          'Sink',
          shortFile(sink.fileName || sink.file || ''),
          sinkCode,
          sink.line || sink.lineNumber
        ));
      }

      scroll.appendChild(codeCard);
    }

    /* ── AI Panel ── */
    if (desc) {
      const aiCard = mkEl('div', 'ai-panel');
      aiCard.innerHTML = '<div class="ai-header">'
        + '<div class="ai-avatar">&#x1F916;</div>'
        + '<div><div class="ai-name">AI Security Assistant</div>'
        + '<div class="ai-role">Checkmarx Insights</div></div>'
        + '</div>'
        + '<div class="ai-body"><div class="ai-desc">' + escHtml(desc) + '</div></div>';
      scroll.appendChild(aiCard);
    }

    /* ── Actions ── */
    const actions = document.getElementById('detail-actions');
    actions.innerHTML = '';

    const openBtn = mkEl('button', 'daction-btn daction-open');
    openBtn.innerHTML = '&#x1F4C2; Open File';
    openBtn.onclick = () => openFile(r);
    actions.appendChild(openBtn);

    const fixBtn = mkEl('button', 'daction-btn daction-fix');
    fixBtn.innerHTML = '&#x26A1; Fix with Copilot';
    fixBtn.onclick = () => fixWithCopilot(r);
    actions.appendChild(fixBtn);

    const sp = mkEl('div', 'daction-spacer');
    actions.appendChild(sp);
  }

  function buildCodeBlock(label, filename, rawCode, line) {
    const wrap = mkEl('div', 'code-section');
    const header = mkEl('div', 'code-header');
    header.innerHTML = '<span class="code-label">&#x2756; ' + label + '</span>'
      + (filename ? '<span class="code-filename">' + escHtml(filename) + '</span>' : '');
    wrap.appendChild(header);

    const pre = mkEl('pre', 'code-pre');
    const lines = rawCode.split('\\n');
    const startLine = (line && typeof line === 'number') ? Math.max(1, line) : 1;

    lines.slice(0, 10).forEach((ln, i) => {
      const lineNum = startLine + i;
      const isHL = i === 0 && label === 'Source' || i === lines.length - 1 && label === 'Sink';
      const lineDiv = mkEl('div', 'code-line' + (isHL ? ' highlight-line' : ''));
      lineDiv.innerHTML = '<span class="code-line-num">' + lineNum + '</span>'
        + '<span class="code-line-text">' + escHtml(ln) + '</span>';
      pre.appendChild(lineDiv);
    });

    wrap.appendChild(pre);
    return wrap;
  }

  /* ─── Actions ─── */
  function openFile(r) {
    const src = getSourceNode(r) || {};
    const fileName = src.fileName || src.file || r.fileName || r.data?.fileName || '';
    const lineNumber = src.line || src.lineNumber || r.line || r.data?.line || 0;
    vscode.postMessage({ type: 'OPEN_FILE', file: fileName, line: lineNumber });
  }

  function fixWithCopilot(r) {
    const src = getSourceNode(r) || {};
    const fileName = src.fileName || src.file || r.fileName || r.data?.fileName || '';
    const code = getCode(src) || getCode(getSinkNode(r)) || '';
    const vulnerability = getQueryName(r);
    const description = getDescription(r);
    const cwe = getCwe(r);
    const sev = normSev(r);

    vscode.postMessage({
      type: 'COPILOT_FIX',
      payload: {
        fileName,
        code,
        vulnerability,
        description,
        cwe,
        severity: sev,
        nodes: getNodes(r)
      }
    });
  }

  function analyzeSelected() {
    if (selectedIdx >= 0 && filtered[selectedIdx]) {
      vscode.postMessage({ type: 'ANALYZE_ISSUE', issue: filtered[selectedIdx] });
    } else {
      vscode.postMessage({ type: 'ANALYZE_SELECTED' });
    }
  }

  function fixSelected() {
    if (selectedIdx >= 0 && filtered[selectedIdx]) {
      fixWithCopilot(filtered[selectedIdx]);
    } else {
      vscode.postMessage({ type: 'FIX_SELECTED' });
    }
  }

  function analyzeAll() {
    vscode.postMessage({ type: 'ANALYZE_ALL' });
  }

  function fixAll() {
    vscode.postMessage({ type: 'FIX_ALL' });
  }

  function exportReport() {
    vscode.postMessage({ type: 'EXPORT_REPORT', data: { scanId: currentScanId, results: allResults } });
  }

  function newScan() {
    vscode.postMessage({ type: 'NEW_SCAN' });
  }

  /* ─── UI Helpers ─── */
  function setStatus(text, type) {
    const badge = document.getElementById('status-badge');
    const dot   = badge.querySelector('.status-dot');
    document.getElementById('status-text').textContent = text;
    badge.className = 'status-badge ' + type;
    dot.className   = 'status-dot' + (type === 'loading' ? ' pulse' : '');
  }

  function showLoading(msg) {
    document.getElementById('loading-text').textContent = msg || 'Loading...';
    document.getElementById('loading-overlay').style.display = 'flex';
  }

  function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
  }

  function mkEl(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function shortFile(path) {
    if (!path) return '';
    const parts = path.replace(/\\\\/g,'/').split('/');
    return parts.slice(-2).join('/');
  }

  function truncate(s, n) {
    return s.length > n ? s.slice(0, n) + '...' : s;
  }

  /* ─── Demo data (fallback) ─── */
  function getDemoData() {
    return [
      {
        queryName: 'Reflected XSS',
        severity: 'HIGH',
        cweId: '79',
        resultDescription: 'User-controlled data flows directly into the HTML response without proper encoding or sanitization, enabling Cross-Site Scripting attacks. An attacker can inject arbitrary JavaScript that executes in the victim browser context.',
        nodes: [
          { name: 'req.query.name', fileName: 'src/routes/user.js', line: 34, code: 'const name = req.query.name;' },
          { name: 'render()', fileName: 'src/routes/user.js', line: 40, code: 'res.send("<h1>Hello " + name + "</h1>");' }
        ]
      },
      {
        queryName: 'SQL Injection',
        severity: 'HIGH',
        cweId: '89',
        resultDescription: 'Unsanitized user input is concatenated directly into an SQL query, allowing an attacker to manipulate database queries and potentially extract, modify, or delete data.',
        nodes: [
          { name: 'req.body.id', fileName: 'src/db/users.js', line: 22, code: 'const id = req.body.id;' },
          { name: 'db.query()', fileName: 'src/db/users.js', line: 28, code: 'db.query("SELECT * FROM users WHERE id = " + id)' }
        ]
      },
      {
        queryName: 'Hardcoded Password',
        severity: 'MEDIUM',
        cweId: '259',
        resultDescription: 'A hardcoded password was found in the source code. This is a security risk as anyone with access to the code can extract the credentials.',
        nodes: [
          { name: 'password', fileName: 'src/config/db.js', line: 5, code: 'const password = "admin123";' }
        ]
      },
      {
        queryName: 'Path Traversal',
        severity: 'HIGH',
        cweId: '22',
        resultDescription: 'User-controlled input is used to construct a file path without proper validation, potentially allowing an attacker to read or write files outside the intended directory.',
        nodes: [
          { name: 'req.params.file', fileName: 'src/files/serve.js', line: 15, code: 'const file = req.params.file;' },
          { name: 'fs.readFile()', fileName: 'src/files/serve.js', line: 20, code: 'fs.readFile("/uploads/" + file, callback)' }
        ]
      },
      {
        queryName: 'Insecure Random',
        severity: 'MEDIUM',
        cweId: '330',
        resultDescription: 'Math.random() is used to generate security-sensitive tokens. This function is not cryptographically secure and can be predicted by an attacker.',
        nodes: [
          { name: 'Math.random()', fileName: 'src/auth/tokens.js', line: 8, code: 'const token = Math.random().toString(36);' }
        ]
      },
      {
        queryName: 'Missing CSRF Protection',
        severity: 'LOW',
        cweId: '352',
        resultDescription: 'State-changing endpoints do not implement CSRF protection, allowing attackers to trick authenticated users into making unintended requests.',
        nodes: [
          { name: 'POST /delete', fileName: 'src/routes/admin.js', line: 45, code: 'app.post("/delete", deleteHandler);' }
        ]
      }
    ];
  }
</script>
</body>
</html>`;
}
