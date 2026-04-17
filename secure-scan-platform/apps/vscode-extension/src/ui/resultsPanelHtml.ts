export function getResultsPanelHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CheckmarkX Results</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-primary: #0d1117;
      --bg-secondary: #161b22;
      --bg-card: #1c2333;
      --bg-hover: #1f2a3a;
      --border: #30363d;
      --text-primary: #e6edf3;
      --text-secondary: #8b949e;
      --text-muted: #484f58;
      --red: #f85149;
      --red-bg: rgba(248,81,73,0.12);
      --red-border: rgba(248,81,73,0.3);
      --orange: #f0883e;
      --orange-bg: rgba(240,136,62,0.12);
      --orange-border: rgba(240,136,62,0.3);
      --green: #3fb950;
      --green-bg: rgba(63,185,80,0.12);
      --green-border: rgba(63,185,80,0.3);
      --blue: #388bfd;
      --blue-bg: rgba(56,139,253,0.12);
      --blue-border: rgba(56,139,253,0.3);
      --cyan: #39d0d8;
      --yellow: #e3b341;
      --yellow-bg: rgba(227,179,65,0.12);
    }

    html, body {
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      height: 100vh;
      overflow: hidden;
    }

    .layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ── TOP BANNER ── */
    .banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--green);
    }

    .banner-left .check { font-size: 16px; }

    .banner-left span.label { color: var(--text-primary); }

    .banner-right { display: flex; gap: 8px; align-items: center; }

    .icon-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text-secondary);
      padding: 4px 8px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.15s;
    }

    .icon-btn:hover { border-color: var(--blue); color: var(--blue); }

    /* ── SUMMARY CARDS ── */
    .summary-row {
      display: flex;
      gap: 10px;
      padding: 10px 16px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .summary-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .summary-card.high {
      background: var(--red-bg);
      border-color: var(--red-border);
    }

    .summary-card.medium {
      background: var(--orange-bg);
      border-color: var(--orange-border);
    }

    .summary-card.low {
      background: var(--green-bg);
      border-color: var(--green-border);
    }

    .summary-card.total {
      background: var(--blue-bg);
      border-color: var(--blue-border);
    }

    .summary-card:hover { filter: brightness(1.15); }

    .summary-icon { font-size: 22px; flex-shrink: 0; }

    .summary-count {
      font-size: 24px;
      font-weight: 800;
      line-height: 1;
    }

    .summary-card.high .summary-count { color: var(--red); }
    .summary-card.medium .summary-count { color: var(--orange); }
    .summary-card.low .summary-count { color: var(--green); }
    .summary-card.total .summary-count { color: var(--blue); }

    .summary-label {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 2px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    /* ── ACTION BAR ── */
    .action-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .btn-action {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }

    .btn-analyze {
      background: var(--blue);
      color: #fff;
    }

    .btn-analyze:hover { background: #1f6feb; }

    .btn-analyze .arrow {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 11px;
      margin-left: 2px;
    }

    .btn-fix {
      background: var(--green);
      color: #0d1117;
    }

    .btn-fix:hover { background: #2ea043; }

    .btn-fix .arrow {
      background: rgba(0,0,0,0.15);
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 11px;
      margin-left: 2px;
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 10px;
    }

    .search-box input {
      background: none;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 13px;
      flex: 1;
      font-family: inherit;
    }

    .search-box input::placeholder { color: var(--text-muted); }

    .select-pill {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 10px;
      color: var(--text-secondary);
      font-size: 12px;
      cursor: pointer;
      appearance: none;
      font-family: inherit;
    }

    /* ── MAIN BODY ── */
    .body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── FILE PANEL ── */
    .file-panel {
      width: 220px;
      flex-shrink: 0;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      background: var(--bg-secondary);
      overflow: hidden;
    }

    .file-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .file-panel-header .header-actions { display: flex; gap: 4px; }
    .file-panel-header .icon-btn { padding: 2px 6px; font-size: 11px; }

    .file-list { overflow-y: auto; flex: 1; }

    .file-item {
      padding: 7px 12px;
      cursor: pointer;
      border-bottom: 1px solid rgba(48,54,61,0.5);
      transition: background 0.15s;
      border-left: 3px solid transparent;
    }

    .file-item:hover { background: var(--bg-hover); }

    .file-item.active {
      background: var(--bg-hover);
      border-left-color: var(--blue);
    }

    .file-item-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .file-item-name {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .file-icon { font-size: 13px; }

    .file-count {
      font-size: 10px;
      color: var(--text-muted);
      background: var(--bg-card);
      padding: 1px 5px;
      border-radius: 10px;
    }

    .file-severity-bar {
      display: flex;
      gap: 3px;
      align-items: center;
    }

    .sev-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .sev-dot.critical, .sev-dot.high { background: var(--red); }
    .sev-dot.medium { background: var(--orange); }
    .sev-dot.low { background: var(--green); }

    .sev-bar {
      height: 4px;
      border-radius: 2px;
      flex: 1;
    }

    .sev-bar.high { background: var(--red); }
    .sev-bar.medium { background: var(--orange); }
    .sev-bar.low { background: var(--green); }

    .sev-num {
      font-size: 10px;
      color: var(--text-muted);
      min-width: 10px;
      text-align: right;
    }

    .hotspot-badge {
      font-size: 9px;
      background: var(--orange-bg);
      color: var(--orange);
      border: 1px solid var(--orange-border);
      border-radius: 4px;
      padding: 1px 5px;
    }

    .file-panel-footer {
      padding: 6px 12px;
      font-size: 10px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    /* ── FINDINGS PANEL ── */
    .findings-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .findings-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-secondary);
      flex-shrink: 0;
      flex-wrap: wrap;
    }

    .findings-file-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .findings-count-badge {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1px 7px;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .spacer { flex: 1; }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .toggle {
      width: 32px;
      height: 17px;
      background: var(--blue);
      border-radius: 10px;
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
    }

    .toggle::after {
      content: '';
      position: absolute;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      top: 2px;
      right: 2px;
      transition: all 0.2s;
    }

    .sort-select {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 5px;
      color: var(--text-secondary);
      font-size: 11px;
      padding: 3px 6px;
      font-family: inherit;
      cursor: pointer;
    }

    .findings-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* ── FINDING CARD ── */
    .finding-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.15s;
    }

    .finding-card:hover { border-color: rgba(56,139,253,0.4); background: var(--bg-hover); }

    .finding-card.active {
      border-color: var(--blue);
      box-shadow: 0 0 0 1px rgba(56,139,253,0.2);
    }

    .finding-card.expanded { border-color: var(--blue); }

    .finding-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
    }

    .sev-badge {
      width: 22px;
      height: 22px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      color: #fff;
    }

    .sev-badge.critical, .sev-badge.high { background: var(--red); }
    .sev-badge.medium { background: var(--orange); color: #0d1117; }
    .sev-badge.low { background: var(--green); color: #0d1117; }

    .finding-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      flex: 1;
    }

    .autofix-badge {
      font-size: 10px;
      background: rgba(63,185,80,0.15);
      color: var(--green);
      border: 1px solid rgba(63,185,80,0.3);
      border-radius: 4px;
      padding: 2px 7px;
      font-weight: 600;
    }

    .finding-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .finding-line {
      font-size: 11px;
      color: var(--text-muted);
    }

    .nav-btns {
      display: flex;
      gap: 2px;
    }

    .nav-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 3px;
      color: var(--text-muted);
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 10px;
      transition: all 0.15s;
    }

    .nav-btn:hover { border-color: var(--blue); color: var(--blue); }

    .sev-label-badge {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .sev-label-badge.critical, .sev-label-badge.high {
      background: var(--red-bg);
      color: var(--red);
      border: 1px solid var(--red-border);
    }

    .sev-label-badge.medium {
      background: var(--orange-bg);
      color: var(--orange);
      border: 1px solid var(--orange-border);
    }

    .sev-label-badge.low {
      background: var(--green-bg);
      color: var(--green);
      border: 1px solid var(--green-border);
    }

    /* ── FINDING EXPANDED BODY ── */
    .finding-body {
      border-top: 1px solid var(--border);
      padding: 10px 12px;
      display: none;
    }

    .finding-card.expanded .finding-body { display: block; }

    .finding-path-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .path-label {
      font-size: 10px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .path-chip {
      font-size: 10px;
      background: var(--blue-bg);
      color: var(--blue);
      border: 1px solid var(--blue-border);
      border-radius: 4px;
      padding: 2px 7px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .path-arrow { color: var(--text-muted); font-size: 11px; }

    .issues-chip {
      font-size: 10px;
      background: var(--red-bg);
      color: var(--red);
      border: 1px solid var(--red-border);
      border-radius: 4px;
      padding: 2px 7px;
    }

    .line-chip {
      font-size: 10px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 2px 7px;
    }

    .code-block {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
      font-family: 'Consolas', 'Cascadia Code', monospace;
      font-size: 12px;
      line-height: 1.6;
      overflow-x: auto;
    }

    .code-block .line { color: var(--text-muted); }
    .code-block .code { color: var(--text-primary); }
    .code-block .highlight { color: var(--red); }

    .finding-hint {
      font-size: 11px;
      color: var(--text-secondary);
      margin-bottom: 10px;
      padding: 6px 10px;
      background: rgba(57,208,216,0.05);
      border-left: 2px solid var(--cyan);
      border-radius: 0 4px 4px 0;
    }

    .finding-hint::before { content: '• '; color: var(--cyan); }

    .finding-actions { display: flex; gap: 8px; }

    .btn-analyze-sm {
      padding: 5px 14px;
      background: var(--blue);
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-analyze-sm:hover { background: #1f6feb; }

    .btn-fix-sm {
      padding: 5px 14px;
      background: var(--green);
      color: #0d1117;
      border: none;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
    }

    .btn-fix-sm:hover { background: #2ea043; }

    .btn-fix-sm .chevron { font-size: 10px; }

    /* ── FOOTER ── */
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    .footer-left { font-size: 11px; color: var(--text-muted); }

    .footer-right { display: flex; gap: 8px; align-items: center; }

    .btn-footer {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-analyze-all {
      background: var(--blue);
      color: #fff;
    }

    .btn-analyze-all:hover { background: #1f6feb; }

    .btn-fix-all {
      background: var(--green);
      color: #0d1117;
    }

    .btn-fix-all:hover { background: #2ea043; }

    .btn-export {
      background: #1f6feb;
      color: #fff;
    }

    .btn-export:hover { background: #388bfd; }

    .btn-back {
      background: var(--bg-card);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn-back:hover { border-color: var(--blue); color: var(--blue); }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #484f58; }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in { animation: fade-in 0.25s ease forwards; }

    .on-prod-badge {
      font-size: 9px;
      background: rgba(248,81,73,0.1);
      color: var(--red);
      border: 1px solid var(--red-border);
      border-radius: 4px;
      padding: 2px 6px;
    }

    .inherit-badge {
      font-size: 9px;
      background: var(--yellow-bg);
      color: var(--yellow);
      border: 1px solid rgba(227,179,65,0.3);
      border-radius: 4px;
      padding: 2px 6px;
    }
  </style>
</head>
<body>
<div class="layout fade-in" id="app">

  <!-- BANNER -->
  <div class="banner">
    <div class="banner-left">
      <span class="check">&#x2713;</span>
      <span style="color:var(--green);font-weight:700;">Analysis Complete!</span>
      <span class="label" style="color:var(--text-secondary);font-weight:400;">Review the findings below.</span>
    </div>
    <div class="banner-right">
      <button class="icon-btn" onclick="newScan()">&#x2699; Settings</button>
    </div>
  </div>

  <!-- SUMMARY CARDS -->
  <div class="summary-row" id="summary-row">
    <div class="summary-card high" onclick="filterBySeverity('high')">
      <span class="summary-icon">&#x26A0;</span>
      <div>
        <div class="summary-count" id="count-high">0</div>
        <div class="summary-label">High Issues</div>
      </div>
    </div>
    <div class="summary-card medium" onclick="filterBySeverity('medium')">
      <span class="summary-icon">&#x26A0;</span>
      <div>
        <div class="summary-count" id="count-medium">0</div>
        <div class="summary-label">Medium Issues</div>
      </div>
    </div>
    <div class="summary-card low" onclick="filterBySeverity('low')">
      <span class="summary-icon">&#x2714;</span>
      <div>
        <div class="summary-count" id="count-low">0</div>
        <div class="summary-label">Low Issues</div>
      </div>
    </div>
    <div class="summary-card total">
      <span class="summary-icon">&#x2261;</span>
      <div>
        <div class="summary-count" id="count-total">0</div>
        <div class="summary-label">Total Findings</div>
      </div>
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="action-bar">
    <button class="btn-action btn-analyze" onclick="analyzeSelected()">
      &#x1F50D; Analyze Selected
      <span class="arrow">&#x276F;</span>
    </button>
    <button class="btn-action btn-fix" onclick="fixSelected()">
      &#x1F527; Fix Selected
      <span class="arrow">&#x276F;</span>
    </button>
    <div class="search-box">
      <span style="color:var(--text-muted);">&#x1F50D;</span>
      <input type="text" id="filter-input" placeholder="Filter issues..." oninput="applyFilter()" />
    </div>
    <select class="select-pill" id="lang-filter" onchange="applyFilter()">
      <option value="">All</option>
      <option value="js">JS</option>
      <option value="py">Python</option>
      <option value="sql">SQL</option>
    </select>
    <select class="select-pill" id="sort-select" onchange="applyFilter()">
      <option value="severity">Severity</option>
      <option value="line">Line</option>
      <option value="title">Title</option>
    </select>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- FILE PANEL -->
    <div class="file-panel">
      <div class="file-panel-header">
        <span>&#x1F4C1; Files <span style="color:var(--text-muted);">&#x2304;</span></span>
        <div class="header-actions">
          <button class="icon-btn">&#x2630;</button>
          <button class="icon-btn">&#x2716;</button>
        </div>
      </div>
      <div class="file-list" id="file-list"></div>
      <div class="file-panel-footer" id="file-footer">Directory: 0 Scanned, 0 issues</div>
    </div>

    <!-- FINDINGS PANEL -->
    <div class="findings-panel">
      <div class="findings-header">
        <span class="findings-file-title" id="findings-title">Select a file</span>
        <span class="findings-count-badge" id="findings-count">0</span>
        <div class="toggle-row" style="margin-left:12px;">
          <span>All Severities</span>
        </div>
        <div class="toggle-row">
          <div class="toggle"></div>
          <span>Auto-Fixable</span>
        </div>
        <div class="spacer"></div>
        <span style="font-size:11px;color:var(--text-muted);">Sort by:</span>
        <select class="sort-select" onchange="applyFilter()">
          <option>Severity</option>
          <option>Line</option>
        </select>
        <button class="icon-btn" style="font-size:11px;">&#x2304;</button>
      </div>
      <div class="findings-list" id="findings-list">
        <div style="color:var(--text-muted);text-align:center;padding:40px;font-size:12px;">
          Select a file from the left panel to view findings
        </div>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-left" id="footer-status">Directory: 0 Scanned, 0 Issues</div>
    <div class="footer-right">
      <button class="btn-footer btn-analyze-all" onclick="analyzeAll()">&#x1F50D; Analyze All</button>
      <button class="btn-footer btn-fix-all" onclick="fixAll()">&#x1F527; Fix All</button>
      <button class="btn-footer btn-export" onclick="exportReport()">Export Report</button>
      <button class="btn-footer btn-back" onclick="newScan()">&#x21B5;</button>
    </div>
  </div>

</div>

<script>
  const vscode = acquireVsCodeApi();

  let allData = null;
  let activeFile = null;
  let severityFilter = null;
  let expandedFindings = new Set();

  function getSevClass(sev) {
    if (!sev) return 'low';
    const s = sev.toLowerCase();
    if (s === 'critical') return 'critical';
    if (s === 'high') return 'high';
    if (s === 'medium') return 'medium';
    return 'low';
  }

  function getSevLetter(sev) {
    if (!sev) return 'L';
    const s = sev.toLowerCase();
    if (s === 'critical') return '!!';
    if (s === 'high') return '!';
    if (s === 'medium') return 'M';
    return 'L';
  }

  function countByFile(files) {
    return files.reduce((acc, f) => acc + (f.issues ? f.issues.length : 0), 0);
  }

  function renderSummary(data) {
    let high = 0, medium = 0, low = 0, total = 0;
    (data.files || []).forEach(f => {
      (f.issues || []).forEach(issue => {
        const s = (issue.severity || '').toLowerCase();
        if (s === 'critical' || s === 'high') high++;
        else if (s === 'medium') medium++;
        else low++;
        total++;
      });
    });
    document.getElementById('count-high').textContent = high;
    document.getElementById('count-medium').textContent = medium;
    document.getElementById('count-low').textContent = low;
    document.getElementById('count-total').textContent = total;
    return { high, medium, low, total };
  }

  function renderFileList(data) {
    const list = document.getElementById('file-list');
    const files = data.files || [];
    let totalIssues = 0;

    list.innerHTML = files.map((f, idx) => {
      const issues = f.issues || [];
      const high = issues.filter(i => ['critical','high'].includes((i.severity||'').toLowerCase())).length;
      const medium = issues.filter(i => (i.severity||'').toLowerCase() === 'medium').length;
      const low = issues.filter(i => !['critical','high','medium'].includes((i.severity||'').toLowerCase())).length;
      totalIssues += issues.length;

      const isActive = idx === 0;
      const ext = (f.name || '').split('.').pop() || '';
      const fileEmoji = ext === 'py' ? '&#x1F40D;' : ext === 'sql' ? '&#x1F4C4;' : '&#x1F4C4;';

      return \`<div class="file-item \${isActive ? 'active' : ''}" onclick="selectFile(\${idx})" id="file-item-\${idx}">
        <div class="file-item-top">
          <div class="file-item-name">
            <span class="file-icon">\${fileEmoji}</span>
            <span>\${f.name}</span>
          </div>
          <span class="file-count">\${issues.length} issues</span>
        </div>
        <div class="file-severity-bar">
          \${high > 0 ? \`<span class="sev-dot high"></span>\` : ''}
          \${medium > 0 ? \`<span class="sev-dot medium"></span>\` : ''}
          \${low > 0 ? \`<span class="sev-dot low"></span>\` : ''}
          <div style="flex:1;display:flex;gap:2px;">
            \${high > 0 ? \`<div class="sev-bar high" style="flex:\${high}"></div>\` : ''}
            \${medium > 0 ? \`<div class="sev-bar medium" style="flex:\${medium}"></div>\` : ''}
            \${low > 0 ? \`<div class="sev-bar low" style="flex:\${low}"></div>\` : ''}
          </div>
          \${high > 0 ? \`<span class="sev-num">\${high}</span>\` : ''}
          \${medium > 0 ? \`<span class="sev-num">\${medium}</span>\` : ''}
        </div>
      </div>\`;
    }).join('');

    document.getElementById('file-footer').textContent =
      \`Directory: \${files.length} Scanned, \${totalIssues} issues\`;
    document.getElementById('footer-status').textContent =
      \`Directory: \${files.length} Scanned, \${totalIssues} Issues\`;

    if (files.length > 0) selectFile(0);
  }

  function selectFile(idx) {
    activeFile = idx;
    document.querySelectorAll('.file-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    const file = (allData.files || [])[idx];
    if (!file) return;

    document.getElementById('findings-title').textContent = file.name;
    renderFindings(file.issues || [], file.name);
  }

  function renderFindings(issues, fileName) {
    const list = document.getElementById('findings-list');
    document.getElementById('findings-count').textContent = issues.length;

    const filterText = (document.getElementById('filter-input').value || '').toLowerCase();

    let filtered = issues.filter(issue => {
      if (severityFilter && (issue.severity || '').toLowerCase() !== severityFilter) return false;
      if (filterText && !(issue.title || '').toLowerCase().includes(filterText)) return false;
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:40px;font-size:12px;">No findings match the current filter</div>';
      return;
    }

    list.innerHTML = filtered.map((issue, idx) => {
      const id = \`\${fileName}-\${idx}\`;
      const sevClass = getSevClass(issue.severity);
      const sevLetter = getSevLetter(issue.severity);
      const isExpanded = expandedFindings.has(id);
      const hasAutoFix = issue.fix || issue.autoFix;
      const isHigh = ['critical','high'].includes(sevClass);

      const extraBadge = issue.onProduction
        ? \`<span class="on-prod-badge">&#x2713; on-Production</span>\`
        : issue.inherited
        ? \`<span class="inherit-badge">INHERIT</span>\`
        : '';

      return \`<div class="finding-card \${isExpanded ? 'expanded' : ''}" id="card-\${id}" onclick="toggleFinding('\${id}', event)">
        <div class="finding-card-header">
          <div class="sev-badge \${sevClass}">\${sevLetter}</div>
          <span class="finding-title">\${issue.title}</span>
          \${isHigh && hasAutoFix ? '<span class="autofix-badge">&#x2714; Auto-Fix Available</span>' : ''}
          \${extraBadge}
          <div class="finding-meta">
            \${issue.line ? \`<span class="finding-line">Line \${issue.line}</span>\` : ''}
            <div class="nav-btns">
              <div class="nav-btn" onclick="event.stopPropagation();">&#x276E;</div>
              <div class="nav-btn" onclick="event.stopPropagation();">&#x276F;</div>
            </div>
            <span class="sev-label-badge \${sevClass}">\${(issue.severity || 'LOW').toUpperCase()}</span>
          </div>
        </div>
        <div class="finding-body">
          <div class="finding-path-row">
            <span class="path-label">&#x1F50D; Critical Path</span>
            <span class="path-chip">&#x1F4C4; \${fileName}</span>
            <span class="path-arrow">&#x27A1;</span>
            <span class="path-chip">&#x26A1; \${fileName}</span>
            <span class="issues-chip">\${filtered.length} issues</span>
            \${issue.line ? \`<span class="line-chip">Line \${issue.line}</span>\` : ''}
          </div>
          \${issue.code ? \`<div class="code-block"><span class="line">//  line \${issue.line || ''}</span>
<span class="code">\${escapeHtml(issue.code)}</span></div>\` : ''}
          \${issue.fix ? \`<div class="finding-hint">\${escapeHtml(issue.fix)}</div>\` : ''}
          <div class="finding-actions">
            <button class="btn-analyze-sm" onclick="event.stopPropagation();analyzeIssue(\${JSON.stringify(issue).replace(/'/g,\\"\\\\\\\\'\\")} )">Analyze</button>
            <button class="btn-fix-sm" onclick="event.stopPropagation();fixIssue(\${JSON.stringify(issue).replace(/'/g,\\"\\\\\\\\'\\")} )">Fix Issue <span class="chevron">&#x276F;</span></button>
          </div>
        </div>
      </div>\`;
    }).join('');
  }

  function toggleFinding(id, event) {
    if (event.target.closest('.nav-btn') || event.target.closest('.btn-analyze-sm') || event.target.closest('.btn-fix-sm')) return;
    const card = document.getElementById('card-' + id);
    if (!card) return;
    if (expandedFindings.has(id)) {
      expandedFindings.delete(id);
      card.classList.remove('expanded');
    } else {
      expandedFindings.add(id);
      card.classList.add('expanded');
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function filterBySeverity(sev) {
    severityFilter = severityFilter === sev ? null : sev;
    if (allData && activeFile !== null) {
      const file = (allData.files || [])[activeFile];
      if (file) renderFindings(file.issues || [], file.name);
    }
  }

  function applyFilter() {
    if (allData && activeFile !== null) {
      const file = (allData.files || [])[activeFile];
      if (file) renderFindings(file.issues || [], file.name);
    }
  }

  function analyzeSelected() {
    vscode.postMessage({ type: 'ANALYZE_SELECTED' });
  }

  function fixSelected() {
    vscode.postMessage({ type: 'FIX_SELECTED' });
  }

  function analyzeAll() {
    vscode.postMessage({ type: 'ANALYZE_ALL' });
  }

  function fixAll() {
    vscode.postMessage({ type: 'FIX_ALL' });
  }

  function exportReport() {
    vscode.postMessage({ type: 'EXPORT_REPORT', data: allData });
  }

  function analyzeIssue(issue) {
    vscode.postMessage({ type: 'ANALYZE_ISSUE', issue });
  }

  function fixIssue(issue) {
    vscode.postMessage({ type: 'FIX_ISSUE', issue });
  }

  function newScan() {
    vscode.postMessage({ type: 'NEW_SCAN' });
  }

  function loadData(data) {
    allData = data;
    renderSummary(data);
    renderFileList(data);
  }

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'LOAD_RESULTS') {
      loadData(msg.data);
    }
  });

  // Load mock data for preview / initial load if extension sends it
  const mockResults = {
    scanId: 30291396,
    files: [
      {
        name: 'app.js',
        issues: [
          {
            title: 'SQL Injection Vulnerability',
            severity: 'critical',
            line: 42,
            code: 'const userId = req.query.id;\\nconst query = \\"SELECT * FROM : WHERE id = \\${userId}\\";',
            fix: 'Use parameterized queries to prevent SQL injection attacks.',
            autoFix: true
          },
          {
            title: 'Cross-Site Scripting (XSS)',
            severity: 'high',
            line: 179,
            code: 'res.send(\\"<div>" + req.body.input + "</div>\\");',
            fix: 'Sanitize user input before rendering in HTML context.'
          },
          {
            title: 'Hardcoded Password',
            severity: 'high',
            line: 91,
            code: 'const password = "admin123";',
            fix: 'Use environment variables for sensitive credentials.',
            onProduction: true
          },
          {
            title: 'Insecure Deserialization',
            severity: 'medium',
            line: 108,
            code: 'const obj = deserialize(req.body.data);',
            fix: 'Validate and sanitize deserialized data.',
            inherited: true
          },
          {
            title: 'Insufficient Input Validation',
            severity: 'medium',
            line: 256,
            code: 'const age = parseInt(req.body.age);',
            fix: 'Validate input ranges and types before processing.'
          }
        ]
      },
      {
        name: 'auth.js',
        issues: [
          {
            title: 'Weak Password Policy',
            severity: 'high',
            line: 14,
            code: 'if (password.length > 4) { return true; }',
            fix: 'Enforce minimum 12-character passwords with complexity requirements.'
          },
          {
            title: 'Missing Rate Limiting',
            severity: 'high',
            line: 33,
            code: 'app.post("/login", loginHandler);',
            fix: 'Add rate limiting middleware to prevent brute-force attacks.'
          },
          {
            title: 'JWT Algorithm None Attack',
            severity: 'medium',
            line: 67,
            code: 'jwt.verify(token, secret, { algorithms: ["none"] });',
            fix: 'Restrict JWT algorithms to approved algorithms only.'
          },
          {
            title: 'Session Fixation',
            severity: 'medium',
            line: 88,
            code: 'req.session.userId = userId;',
            fix: 'Regenerate session ID on authentication.',
            autoFix: true
          }
        ]
      },
      {
        name: 'utils.py',
        issues: [
          {
            title: 'Command Injection',
            severity: 'critical',
            line: 22,
            code: 'os.system("ping " + host)',
            fix: 'Use subprocess with argument lists, never shell=True with user input.',
            autoFix: true
          },
          {
            title: 'Path Traversal',
            severity: 'high',
            line: 45,
            code: 'open(base_dir + "/" + filename)',
            fix: 'Use os.path.realpath() and validate path is within allowed directory.'
          },
          {
            title: 'Insecure Random',
            severity: 'medium',
            line: 71,
            code: 'token = random.randint(0, 999999)',
            fix: 'Use secrets.token_hex() for cryptographically secure tokens.'
          },
          {
            title: 'Open Redirect',
            severity: 'medium',
            line: 103,
            code: 'return redirect(request.args.get("next"))',
            fix: 'Validate redirect URLs against an allowlist.'
          },
          {
            title: 'Sensitive Data Exposure',
            severity: 'low',
            line: 140,
            code: 'logger.debug("User password: " + password)',
            fix: 'Never log sensitive data such as passwords or tokens.'
          },
          {
            title: 'Missing CSRF Protection',
            severity: 'low',
            line: 188,
            code: '@app.route("/delete", methods=["POST"])',
            fix: 'Add CSRF token validation to state-changing endpoints.'
          }
        ]
      },
      {
        name: 'migrations/001_initial.sql',
        issues: [
          {
            title: 'Overprivileged Role',
            severity: 'medium',
            line: 12,
            code: 'GRANT ALL PRIVILEGES ON *.* TO "app_user"@"%";',
            fix: 'Follow principle of least privilege — grant only required permissions.'
          },
          {
            title: 'Missing Column Encryption',
            severity: 'low',
            line: 34,
            code: 'ssn VARCHAR(11) NOT NULL',
            fix: 'Encrypt PII columns at rest using database-level encryption.'
          }
        ]
      }
    ]
  };

  loadData(mockResults);
</script>
</body>
</html>`;
}
