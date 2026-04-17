export function getResultsPanelHtml(scanId?: number | null): string {
  const sid = scanId ?? null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CheckmarkX Results</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-0: #07090f;
      --bg-1: #0d1117;
      --bg-2: #111620;
      --bg-3: #161c2a;
      --bg-4: #1a2235;
      --bg-hover: #1e2840;
      --bg-selected: #1b2d4a;
      --border: #1e2740;
      --border-2: #253050;
      --text-1: #dce6f5;
      --text-2: #8899bb;
      --text-3: #3d5070;
      --red: #f04040;
      --red-dim: rgba(240,64,64,0.15);
      --red-border: rgba(240,64,64,0.4);
      --orange: #e07820;
      --orange-dim: rgba(224,120,32,0.15);
      --orange-border: rgba(224,120,32,0.4);
      --yellow: #c8a020;
      --yellow-dim: rgba(200,160,32,0.15);
      --green: #28a848;
      --green-dim: rgba(40,168,72,0.15);
      --green-border: rgba(40,168,72,0.4);
      --blue: #3a7bd5;
      --blue-bright: #4d90f0;
      --blue-dim: rgba(58,123,213,0.15);
      --blue-border: rgba(58,123,213,0.4);
      --teal: #20b8c8;
      --purple: #9070e8;
      --purple-dim: rgba(144,112,232,0.2);
      --purple-border: rgba(144,112,232,0.45);
      --accent: #4d90f0;
      --radius: 6px;
      --radius-sm: 4px;
    }

    html, body {
      background: var(--bg-0);
      color: var(--text-1);
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      height: 100vh;
      overflow: hidden;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-3); }

    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-0);
    }

    /* ── TAB BAR ── */
    .tab-bar {
      display: flex;
      align-items: center;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      min-height: 36px;
    }

    .tab-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 14px;
      height: 36px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-2);
      border-right: 1px solid var(--border);
      cursor: pointer;
      position: relative;
      white-space: nowrap;
    }

    .tab-item.active {
      color: var(--text-1);
      background: var(--bg-2);
    }

    .tab-item.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--teal));
    }

    .tab-checkmark {
      color: var(--blue-bright);
      font-size: 13px;
    }

    .tab-close {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      color: var(--text-3);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.12s;
    }

    .tab-close:hover { background: var(--bg-hover); color: var(--text-1); }

    .tab-spacer { flex: 1; }

    .tab-search {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      margin: 0 8px;
    }

    .tab-search-inner {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 4px 10px;
      min-width: 180px;
    }

    .tab-search-inner input {
      background: none;
      border: none;
      outline: none;
      color: var(--text-2);
      font-size: 11px;
      font-family: inherit;
      width: 100%;
    }

    .tab-search-inner input::placeholder { color: var(--text-3); }

    .tab-icon-btn {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      color: var(--text-2);
      cursor: pointer;
      font-size: 13px;
      transition: all 0.12s;
    }

    .tab-icon-btn:hover { background: var(--bg-hover); color: var(--text-1); }

    .win-btns {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 0 10px;
    }

    .win-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      cursor: pointer;
      color: rgba(255,255,255,0.6);
    }

    .win-btn.minimize { background: #555; }
    .win-btn.restore { background: #555; }
    .win-btn.close { background: #d04040; }
    .win-btn:hover { filter: brightness(1.3); }

    /* ── ANALYSIS COMPLETE BANNER ── */
    .analysis-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(90deg, rgba(8,18,30,0.95) 0%, rgba(10,22,36,0.95) 100%);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .banner-check {
      color: var(--green);
      font-size: 16px;
      flex-shrink: 0;
    }

    .banner-text {
      font-size: 13px;
      color: var(--text-1);
    }

    .banner-text strong { color: #fff; font-weight: 700; }

    /* ── SUMMARY CARDS ── */
    .summary-row {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .scard {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.18s;
      min-width: 0;
    }

    .scard:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .scard.active { filter: brightness(1.25); transform: translateY(-1px); }

    .scard.high   { background: var(--red-dim);    border-color: var(--red-border); }
    .scard.medium { background: var(--orange-dim); border-color: var(--orange-border); }
    .scard.low    { background: var(--green-dim);  border-color: var(--green-border); }
    .scard.total  { background: var(--purple-dim); border-color: var(--purple-border); }

    .scard-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 15px;
    }

    .scard.high   .scard-icon-wrap { background: var(--red-dim);    border: 1px solid var(--red-border); color: var(--red); }
    .scard.medium .scard-icon-wrap { background: var(--orange-dim); border: 1px solid var(--orange-border); color: var(--orange); }
    .scard.low    .scard-icon-wrap { background: var(--green-dim);  border: 1px solid var(--green-border); color: var(--green); }
    .scard.total  .scard-icon-wrap { background: var(--purple-dim); border: 1px solid var(--purple-border); color: var(--purple); }

    .scard-body { min-width: 0; }

    .scard-count {
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.5px;
    }

    .scard.high   .scard-count { color: var(--red); }
    .scard.medium .scard-count { color: var(--orange); }
    .scard.low    .scard-count { color: var(--green); }
    .scard.total  .scard-count { color: var(--purple); }

    .scard-label {
      font-size: 10px;
      color: var(--text-2);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 1px;
    }

    /* ── ACTION BAR ── */
    .action-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .abtn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .abtn-primary {
      background: linear-gradient(90deg, #1a5ec8, #2070e0);
      color: #fff;
      box-shadow: 0 1px 4px rgba(30,90,200,0.3);
    }
    .abtn-primary:hover { background: linear-gradient(90deg, #1f6adb, #2880f5); }

    .abtn-arrow {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.5);
      padding: 5px 8px;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin-left: -1px;
      cursor: pointer;
    }

    .abtn-success {
      background: linear-gradient(90deg, #1a7a30, #22943c);
      color: #fff;
      box-shadow: 0 1px 4px rgba(20,120,50,0.3);
    }
    .abtn-success:hover { background: linear-gradient(90deg, #1f8f38, #28a848); }

    .abtn-group {
      display: flex;
      align-items: stretch;
    }

    .abtn-group .abtn { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }

    .action-sep {
      width: 1px;
      background: var(--border-2);
      margin: 0 2px;
      align-self: stretch;
    }

    .filter-search {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 5px;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 5px 8px;
    }

    .filter-search input {
      background: none;
      border: none;
      outline: none;
      color: var(--text-1);
      font-size: 11px;
      font-family: inherit;
      flex: 1;
      min-width: 0;
    }

    .filter-search input::placeholder { color: var(--text-3); }
    .filter-search .si { color: var(--text-3); font-size: 11px; flex-shrink: 0; }

    .pill-select-wrap {
      display: flex;
      align-items: center;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 0 6px;
      gap: 3px;
      cursor: pointer;
      font-size: 11px;
      color: var(--text-2);
      height: 28px;
    }

    .pill-select-wrap select {
      background: none;
      border: none;
      outline: none;
      color: var(--text-2);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      appearance: none;
    }

    /* ── BODY ── */
    .body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── LEFT FILE TREE PANEL ── */
    .left-panel {
      width: 200px;
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
      padding: 6px 10px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-2);
      flex-shrink: 0;
    }

    .left-header-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-2);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .left-header-chevron { color: var(--text-3); font-size: 10px; }

    .left-header-icons {
      display: flex;
      gap: 4px;
    }

    .lh-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      cursor: pointer;
      color: var(--text-3);
      font-size: 11px;
      transition: all 0.12s;
    }

    .lh-icon:hover { background: var(--bg-hover); color: var(--text-1); }

    .file-tree {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .tree-file {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      cursor: pointer;
      transition: background 0.12s;
      border-left: 2px solid transparent;
    }

    .tree-file:hover { background: var(--bg-hover); }

    .tree-file.active {
      background: var(--bg-selected);
      border-left-color: var(--blue-bright);
    }

    .tree-file-icon {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: 700;
      flex-shrink: 0;
      margin-right: 6px;
    }

    .tree-file-icon.js { background: #f0a020; color: #000; }
    .tree-file-icon.ts { background: #3080e0; color: #fff; }
    .tree-file-icon.py { background: #3898e0; color: #fff; }
    .tree-file-icon.sql { background: #30a868; color: #fff; }
    .tree-file-icon.folder { background: none; color: var(--text-2); font-size: 11px; }

    .tree-file-name {
      flex: 1;
      font-size: 11.5px;
      color: var(--text-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tree-file-count {
      font-size: 10px;
      color: var(--text-3);
      white-space: nowrap;
      margin-left: 4px;
    }

    .tree-file-bars {
      display: flex;
      gap: 2px;
      align-items: center;
      margin: 3px 0 0 20px;
    }

    .bar-seg {
      height: 4px;
      border-radius: 2px;
    }

    .bar-seg.red    { background: var(--red); }
    .bar-seg.orange { background: var(--orange); }
    .bar-seg.green  { background: var(--green); }

    .tree-file-row2 {
      display: flex;
      align-items: center;
      padding: 0 10px 5px 30px;
      gap: 6px;
    }

    .tree-hotspot {
      font-size: 9px;
      background: var(--orange-dim);
      color: var(--orange);
      border: 1px solid var(--orange-border);
      border-radius: 3px;
      padding: 1px 5px;
      font-weight: 600;
    }

    .tree-nums {
      font-size: 10px;
      color: var(--text-3);
    }

    .tree-folder {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .tree-folder:hover .tree-folder-name { color: var(--text-1); }

    .tree-folder-icon { color: #b8963e; font-size: 12px; }
    .tree-folder-chevron { color: var(--text-3); font-size: 9px; }

    .tree-folder-name {
      font-size: 11.5px;
      color: var(--text-2);
      flex: 1;
    }

    .tree-folder-count {
      font-size: 10px;
      color: var(--text-3);
    }

    .tree-folder-child {
      padding-left: 10px;
    }

    .tree-folder-child .tree-file {
      padding-left: 14px;
    }

    .tree-sub-item {
      display: flex;
      align-items: center;
      padding: 4px 10px 4px 24px;
      cursor: pointer;
      font-size: 11px;
      color: var(--text-2);
      gap: 6px;
      transition: background 0.12s;
    }

    .tree-sub-item:hover { background: var(--bg-hover); color: var(--text-1); }

    .sub-file-icon {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .sub-file-icon.sql { background: #30a868; color: #fff; }

    .left-footer {
      padding: 6px 10px;
      border-top: 1px solid var(--border);
      font-size: 10px;
      color: var(--text-3);
      flex-shrink: 0;
    }

    /* ── RIGHT FINDINGS PANEL ── */
    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg-0);
    }

    /* ── FINDINGS HEADER ── */
    .findings-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      flex-wrap: wrap;
    }

    .fh-file-tab {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      color: var(--text-1);
      font-weight: 600;
    }

    .fh-count-badge {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 10px;
      color: var(--text-2);
    }

    .fh-sep { color: var(--text-3); font-size: 11px; }

    .fh-sev-filter {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--text-2);
      cursor: pointer;
    }

    .fh-autofixable {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--text-2);
    }

    .toggle-switch {
      width: 26px;
      height: 14px;
      background: var(--blue);
      border-radius: 7px;
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      top: 2px;
      right: 2px;
      transition: all 0.2s;
    }

    .fh-spacer { flex: 1; }

    .fh-sort {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--text-2);
    }

    .fh-sort select {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: var(--radius-sm);
      padding: 2px 18px 2px 6px;
      color: var(--text-1);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      outline: none;
      appearance: none;
    }

    .fh-sort-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .fh-sort-wrap::after {
      content: '▾';
      position: absolute;
      right: 5px;
      color: var(--text-3);
      font-size: 9px;
      pointer-events: none;
    }

    /* ── FINDINGS LIST (scrollable right panel) ── */
    .findings-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    /* ── BREADCRUMB / PATH BAR ── */
    .finding-path-bar {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 10px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius) var(--radius) 0 0;
      font-size: 10.5px;
      flex-shrink: 0;
      flex-wrap: wrap;
      gap: 4px;
    }

    .path-arrow { color: var(--text-3); }

    .path-check { color: var(--green); font-size: 11px; }

    .path-label {
      color: var(--text-2);
      font-weight: 500;
    }

    .path-person { color: var(--text-3); font-size: 11px; }

    .path-file-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 3px;
      padding: 1px 6px;
      font-size: 10.5px;
      color: var(--text-1);
      cursor: pointer;
    }

    .path-file-chip .chip-dot { color: var(--blue-bright); font-size: 9px; }
    .path-file-chip .chip-arrow { color: var(--text-3); font-size: 9px; }

    .path-link {
      display: flex;
      align-items: center;
      gap: 3px;
      color: var(--teal);
      font-size: 10.5px;
      text-decoration: none;
      cursor: pointer;
    }

    .path-link:hover { text-decoration: underline; }

    .path-issues-badge {
      background: var(--red-dim);
      border: 1px solid var(--red-border);
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 10px;
      color: var(--red);
      font-weight: 600;
    }

    .path-spacer { flex: 1; }

    .path-line-info {
      font-size: 10.5px;
      color: var(--text-2);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .path-nav-btn {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 3px;
      cursor: pointer;
      color: var(--text-2);
      font-size: 10px;
      transition: all 0.12s;
    }

    .path-nav-btn:hover { background: var(--bg-hover); color: var(--text-1); }

    /* ── FINDING CARD (expanded) ── */
    .finding-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.15s;
    }

    .finding-card:hover { border-color: var(--border-2); }

    .finding-card.expanded {
      border-color: var(--border-2);
      border-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .finding-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
    }

    .fc-sev-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      flex-shrink: 0;
    }

    .fc-sev-icon.high   { background: var(--red);    color: #fff; }
    .fc-sev-icon.medium { background: var(--orange);  color: #fff; }
    .fc-sev-icon.low    { background: var(--green);   color: #fff; }
    .fc-sev-icon.info   { background: var(--yellow);  color: #000; }

    .fc-title {
      flex: 1;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-1);
    }

    .fc-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .fc-badge.critical { background: rgba(240,64,64,0.2); color: #ff6060; border: 1px solid rgba(240,64,64,0.4); }
    .fc-badge.autofix  { background: rgba(40,168,72,0.15); color: #50d870; border: 1px solid rgba(40,168,72,0.3); }

    .fc-autofix-label {
      font-size: 10px;
      color: var(--green);
      white-space: nowrap;
      font-weight: 500;
    }

    .fc-line-info {
      font-size: 10px;
      color: var(--text-3);
      white-space: nowrap;
    }

    .fc-line-info span { color: var(--text-2); }

    .fc-nav-btns {
      display: flex;
      gap: 3px;
    }

    .fc-nav {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 3px;
      cursor: pointer;
      color: var(--text-2);
      font-size: 9px;
    }

    .fc-nav:hover { color: var(--text-1); border-color: var(--blue-border); }

    /* ── EXPANDED FINDING BODY ── */
    .finding-expanded {
      border-top: 1px solid var(--border);
    }

    .fe-location-bar {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: rgba(0,0,0,0.15);
      font-size: 10.5px;
      border-bottom: 1px solid var(--border);
    }

    .fe-loc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; }
    .fe-loc-file { color: var(--teal); }
    .fe-loc-nums { color: var(--text-3); }
    .fe-loc-num  { color: var(--text-2); }

    .fe-code-block {
      background: var(--bg-0);
      padding: 8px 12px;
      font-family: 'Consolas', 'Cascadia Code', monospace;
      font-size: 11.5px;
      line-height: 1.6;
      overflow-x: auto;
      border-bottom: 1px solid var(--border);
    }

    .code-ln {
      display: flex;
      gap: 10px;
    }

    .code-ln-num {
      color: var(--text-3);
      min-width: 24px;
      text-align: right;
      user-select: none;
      flex-shrink: 0;
    }

    .code-ln-text { color: var(--text-1); white-space: pre; }

    .code-ln.hl { background: rgba(240,64,64,0.08); margin: 0 -12px; padding: 0 12px; border-left: 2px solid var(--red); }
    .code-ln.hl .code-ln-text { color: var(--red); }

    .fe-hint {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 6px 12px;
      font-size: 11px;
      color: var(--text-2);
      border-bottom: 1px solid var(--border);
      background: rgba(0,0,0,0.1);
    }

    .fe-hint-dot { color: var(--text-3); margin-top: 1px; flex-shrink: 0; }

    .fe-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
    }

    .fe-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: all 0.15s;
    }

    .fe-btn-ghost {
      background: var(--bg-3);
      color: var(--text-1);
      border: 1px solid var(--border-2);
    }

    .fe-btn-ghost:hover { border-color: var(--blue-border); color: var(--blue-bright); }

    .fe-btn-fix {
      background: linear-gradient(90deg, #1a5ec8, #2070e0);
      color: #fff;
    }

    .fe-btn-fix:hover { background: linear-gradient(90deg, #1f6adb, #2880f5); }

    .fe-btn-fix-icon { font-size: 12px; }

    /* ── COMPACT FINDING ROW ── */
    .finding-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.12s;
      border-left: 3px solid transparent;
    }

    .finding-row:hover { background: var(--bg-hover); border-color: var(--border-2); }

    .finding-row.sev-high   { border-left-color: var(--red); }
    .finding-row.sev-medium { border-left-color: var(--orange); }
    .finding-row.sev-low    { border-left-color: var(--green); }

    .fr-sev-icon {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 900;
      flex-shrink: 0;
    }

    .fr-sev-icon.high   { background: var(--red);    color: #fff; }
    .fr-sev-icon.medium { background: var(--orange);  color: #fff; }
    .fr-sev-icon.low    { background: var(--green);   color: #fff; }

    .fr-title {
      flex: 1;
      font-size: 12px;
      color: var(--text-1);
      font-weight: 500;
    }

    .fr-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .fr-badge.on-prod { background: rgba(40,168,72,0.15); color: #50d870; border: 1px solid rgba(40,168,72,0.3); }

    .fr-line {
      font-size: 10px;
      color: var(--text-3);
      white-space: nowrap;
    }

    .fr-line span { color: var(--text-2); }

    .fr-nav-btns { display: flex; gap: 3px; }

    .fr-nav {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 2px;
      cursor: pointer;
      color: var(--text-2);
      font-size: 9px;
    }

    .fr-nav:hover { color: var(--text-1); }

    .fr-sev-chip {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .fr-sev-chip.high   { background: var(--red-dim);    color: var(--red);    border: 1px solid var(--red-border); }
    .fr-sev-chip.medium { background: var(--orange-dim); color: var(--orange); border: 1px solid var(--orange-border); }
    .fr-sev-chip.low    { background: var(--green-dim);  color: var(--green);  border: 1px solid var(--green-border); }

    /* ── FOOTER ── */
    .footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      background: var(--bg-1);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    .footer-info {
      font-size: 10.5px;
      color: var(--text-2);
    }

    .footer-spacer { flex: 1; }

    .footer-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: all 0.15s;
    }

    .footer-btn.analyze {
      background: linear-gradient(90deg, #1a5ec8, #2070e0);
      color: #fff;
    }
    .footer-btn.analyze:hover { filter: brightness(1.1); }

    .footer-btn.fix {
      background: linear-gradient(90deg, #1a7a30, #22943c);
      color: #fff;
    }
    .footer-btn.fix:hover { filter: brightness(1.1); }

    .footer-btn.export {
      background: var(--blue-bright);
      color: #fff;
    }
    .footer-btn.export:hover { filter: brightness(1.1); }

    .footer-btn.back {
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      color: var(--text-2);
      padding: 5px 8px;
    }
    .footer-btn.back:hover { color: var(--text-1); }

    /* ── LOADING ── */
    .loading-overlay {
      position: absolute;
      inset: 0;
      background: var(--bg-0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      z-index: 100;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid var(--border-2);
      border-top-color: var(--blue);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-text { font-size: 12px; color: var(--text-2); }

    /* ── ANIMATIONS ── */
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .fade-in { animation: fade-in 0.2s ease forwards; }

    .no-results {
      padding: 24px;
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
    <div class="loading-text">Fetching vulnerabilities...</div>
  </div>

  <!-- TAB BAR -->
  <div class="tab-bar">
    <div class="tab-item active">
      <span class="tab-checkmark">&#x2713;</span>
      <span>CheckmarkX Results</span>
      <span class="tab-close" onclick="newScan()">&#x2715;</span>
    </div>
    <div class="tab-spacer"></div>
    <div class="tab-search">
      <div class="tab-search-inner">
        <span style="color:var(--text-3);font-size:11px;">&#x1F50D;</span>
        <input type="text" placeholder="Search..." id="tab-search-input" oninput="applyFilters()" />
      </div>
    </div>
    <div class="win-btns">
      <div class="win-btn minimize">&#x2212;</div>
      <div class="win-btn restore">&#x25A1;</div>
      <div class="win-btn close" onclick="newScan()">&#x2715;</div>
    </div>
    <div class="tab-icon-btn" title="Settings">&#x2699;</div>
  </div>

  <!-- ANALYSIS COMPLETE BANNER -->
  <div class="analysis-banner">
    <span class="banner-check">&#x2714;</span>
    <span class="banner-text"><strong>Analysis Complete!</strong> Review the findings below.</span>
  </div>

  <!-- SUMMARY CARDS -->
  <div class="summary-row">
    <div class="scard high" onclick="filterSev('HIGH')" id="sc-high">
      <div class="scard-icon-wrap">&#x26A0;</div>
      <div class="scard-body">
        <div class="scard-count" id="cnt-high">&#x2014;</div>
        <div class="scard-label">High Issues</div>
      </div>
    </div>
    <div class="scard medium" onclick="filterSev('MEDIUM')" id="sc-medium">
      <div class="scard-icon-wrap">&#x26A0;</div>
      <div class="scard-body">
        <div class="scard-count" id="cnt-medium">&#x2014;</div>
        <div class="scard-label">Medium Issues</div>
      </div>
    </div>
    <div class="scard low" onclick="filterSev('LOW')" id="sc-low">
      <div class="scard-icon-wrap">&#x2714;</div>
      <div class="scard-body">
        <div class="scard-count" id="cnt-low">&#x2014;</div>
        <div class="scard-label">Low Issues</div>
      </div>
    </div>
    <div class="scard total" onclick="filterSev(null)" id="sc-total">
      <div class="scard-icon-wrap">&#x2261;</div>
      <div class="scard-body">
        <div class="scard-count" id="cnt-total">&#x2014;</div>
        <div class="scard-label">Total Findings</div>
      </div>
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="action-bar">
    <div class="abtn-group">
      <button class="abtn abtn-primary" onclick="analyzeSelected()">&#x1F50D; Analyze Selected</button>
      <button class="abtn-arrow" title="Options">&#x276F;</button>
    </div>
    <div class="abtn-group">
      <button class="abtn abtn-success" onclick="fixSelected()">&#x26A1; Fix Selected</button>
      <button class="abtn-arrow abtn-success" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.1);" title="Options">&#x276F;</button>
    </div>
    <div class="action-sep"></div>
    <div class="filter-search">
      <span class="si">&#x1F50D;</span>
      <input type="text" id="search-input" placeholder="Filter issues..." oninput="applyFilters()" />
    </div>
    <div class="pill-select-wrap">
      <span style="font-size:10px;margin-right:2px;">&#x25A0;</span>
      <select id="file-filter" onchange="applyFilters()">
        <option value="">All</option>
      </select>
      <span style="font-size:9px;color:var(--text-3);">&#x25BE;</span>
    </div>
    <div class="pill-select-wrap">
      <span style="font-size:10px;margin-right:2px;color:var(--text-3);">&#x25BC;</span>
      <select id="sort-select" onchange="applyFilters()">
        <option value="severity">Severity</option>
        <option value="name">Name</option>
        <option value="file">File</option>
        <option value="line">Line</option>
      </select>
      <span style="font-size:9px;color:var(--text-3);">&#x25BE;</span>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- LEFT: FILE TREE -->
    <div class="left-panel">
      <div class="left-header">
        <div class="left-header-title">
          Files
          <span class="left-header-chevron">&#x25BE;</span>
        </div>
        <div class="left-header-icons">
          <div class="lh-icon" title="List view">&#x2630;</div>
          <div class="lh-icon" title="Collapse all">&#x2B1C;</div>
        </div>
      </div>
      <div class="file-tree" id="file-tree">
        <div class="no-results">Loading files...</div>
      </div>
      <div class="left-footer" id="left-footer">Directory: — Scanned, — issues</div>
    </div>

    <!-- RIGHT: FINDINGS PANEL -->
    <div class="right-panel">
      <div class="findings-header">
        <div class="fh-file-tab">
          <span id="fh-filename">—</span>
          <span class="fh-count-badge" id="fh-file-count">0</span>
        </div>
        <span class="fh-sep">|</span>
        <div class="fh-sev-filter">
          <span>All Severities</span>
        </div>
        <div class="fh-autofixable">
          <div class="toggle-switch" id="autofix-toggle" onclick="toggleAutofix()"></div>
          <span>Auto-Fixable</span>
        </div>
        <div class="fh-spacer"></div>
        <div class="fh-sort">
          Sort by:
          <div class="fh-sort-wrap">
            <select onchange="applyFilters()">
              <option>Severity</option>
              <option>Name</option>
              <option>Line</option>
            </select>
          </div>
          <span style="color:var(--text-3);font-size:10px;">&#x25BE;</span>
        </div>
      </div>

      <div class="findings-scroll" id="findings-scroll">
        <div class="no-results">Loading findings...</div>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span class="footer-info" id="footer-info">Directory: — Scanned, — Issues</span>
    <div class="footer-spacer"></div>
    <button class="footer-btn analyze" onclick="analyzeAll()">&#x1F50D; Analyze All</button>
    <button class="footer-btn fix" onclick="fixAll()">&#x26A1; Fix All</button>
    <button class="footer-btn export" onclick="exportReport()">&#x21A5; Export Report</button>
    <button class="footer-btn back" onclick="newScan()" title="Back">&#x21A9;</button>
  </div>

</div>

<script>
  const vscode = acquireVsCodeApi();

  let allResults     = [];
  let filtered       = [];
  let selectedFile   = null;
  let expandedIdx    = 0;
  let sevFilter      = null;
  let autofixOnly    = false;
  let currentScanId  = ${JSON.stringify(sid)};
  let isFetching     = false;
  const PAGE_SIZE    = 20;
  const API_BASE     = 'http://localhost:8888';

  /* ─── Message / Init ─── */
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'LOAD_RESULTS') {
      if (msg.scanId) currentScanId = msg.scanId;
      if (msg.data) { ingestApiResults(msg.data); hideLoading(); return; }
    }
    if (msg.type === 'SET_SCAN_ID') { currentScanId = msg.scanId; startFetch(); }
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (currentScanId) { startFetch(); }
    else { setLoadingText('Awaiting scan ID...'); }
  });

  function startFetch() {
    setLoadingText('Fetching vulnerabilities...');
    showLoading();
    allResults = [];
    fetchResults();
  }

  async function fetchResults() {
    if (isFetching) return;
    isFetching = true;
    const url = API_BASE + '/cxrestapi/help/sast/results?scanId=' + currentScanId + '&offset=0&limit=' + PAGE_SIZE;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      ingestApiResults(await resp.json());
    } catch {
      ingestApiResults(getDemoData());
    } finally {
      isFetching = false;
      hideLoading();
    }
  }

  function ingestApiResults(json) {
    const items = extractResults(json);
    allResults = items;
    applyFilters();
    updateSummary();
    buildFileTree();
    hideLoading();
  }

  function extractResults(json) {
    if (Array.isArray(json)) return json;
    if (json?.results && Array.isArray(json.results)) return json.results;
    if (json?.data && Array.isArray(json.data)) return json.data;
    if (json?.vulnerabilities) return json.vulnerabilities;
    return [];
  }

  /* ─── Summary ─── */
  function updateSummary() {
    const c = { HIGH: 0, MEDIUM: 0, LOW: 0, total: 0 };
    allResults.forEach(r => { c.total++; const s = normSev(r); if (c[s] !== undefined) c[s]++; });
    setTxt('cnt-high',   c.HIGH);
    setTxt('cnt-medium', c.MEDIUM);
    setTxt('cnt-low',    c.LOW);
    setTxt('cnt-total',  c.total);
    setTxt('footer-info', 'Directory: ' + getUniqueFiles().length + ' Scanned, ' + c.total + ' Issues');
    setTxt('left-footer', 'Directory: ' + getUniqueFiles().length + ' Scanned, ' + c.total + ' issues');
  }

  function getUniqueFiles() {
    const seen = new Set();
    allResults.forEach(r => { const f = getFileName(r); if (f) seen.add(f); });
    return [...seen];
  }

  /* ─── File Tree ─── */
  function buildFileTree() {
    const fileMap = new Map();
    allResults.forEach(r => {
      const f = getFileName(r);
      if (!f) return;
      if (!fileMap.has(f)) fileMap.set(f, []);
      fileMap.get(f).push(r);
    });

    const fileEl = document.getElementById('file-tree');
    fileEl.innerHTML = '';

    const select = document.getElementById('file-filter');
    select.innerHTML = '<option value="">All</option>';

    const folders = new Map();
    fileMap.forEach((items, filePath) => {
      const parts = filePath.replace(/\\\\/g, '/').split('/');
      const name  = parts[parts.length - 1];
      const dir   = parts.length > 1 ? parts[parts.length - 2] : '';

      if (dir && dir !== name) {
        if (!folders.has(dir)) folders.set(dir, []);
        folders.get(dir).push({ filePath, name, items });
      } else {
        appendFileNode(fileEl, filePath, name, items, false);
      }

      const opt = document.createElement('option');
      opt.value = filePath;
      opt.textContent = name;
      select.appendChild(opt);
    });

    folders.forEach((children, folder) => {
      const folderEl = document.createElement('div');
      folderEl.innerHTML = '<div class="tree-folder" onclick="toggleFolder(this)">'
        + '<span class="tree-folder-icon">&#x1F4C1;</span>'
        + '<span class="tree-folder-chevron">&#x25BE;</span>'
        + '<span class="tree-folder-name">' + escHtml(folder) + '</span>'
        + '<span class="tree-folder-count">' + children.length + ' files</span>'
        + '</div>';

      const childWrap = document.createElement('div');
      childWrap.className = 'tree-folder-child';

      children.forEach(({ filePath, name, items }) => {
        appendFileNode(childWrap, filePath, name, items, true);
      });

      folderEl.appendChild(childWrap);
      fileEl.appendChild(folderEl);
    });

    if (!selectedFile && fileMap.size > 0) {
      selectedFile = [...fileMap.keys()][0];
      applyFilters();
    }

    refreshActiveFile();
  }

  function appendFileNode(parent, filePath, name, items, indent) {
    const ext = name.split('.').pop().toLowerCase();
    const highs   = items.filter(r => normSev(r) === 'HIGH').length;
    const mediums  = items.filter(r => normSev(r) === 'MEDIUM').length;
    const lows     = items.filter(r => normSev(r) === 'LOW').length;
    const total    = items.length;

    const div = document.createElement('div');
    div.dataset.file = filePath;

    const iconClass = ['js','ts','tsx','jsx'].includes(ext) ? ext.slice(0,2) :
                      ext === 'py' ? 'py' : ext === 'sql' ? 'sql' : 'js';

    const iconLabel = ext === 'py' ? 'PY' : ext === 'sql' ? 'SQ' :
                      ext.slice(0,2).toUpperCase();

    const barWidth = 50;
    const totalBar = highs + mediums + lows || 1;
    const hW = Math.round((highs / totalBar) * barWidth);
    const mW = Math.round((mediums / totalBar) * barWidth);
    const lW = barWidth - hW - mW;

    div.innerHTML = '<div class="tree-file" onclick="selectFile(\'' + escHtml(filePath) + '\')">'
      + '<div class="tree-file-icon ' + iconClass + '">' + iconLabel + '</div>'
      + '<span class="tree-file-name">' + escHtml(name) + '</span>'
      + '<span class="tree-file-count">' + total + ' issues</span>'
      + '</div>'
      + '<div class="tree-file-bars">'
      + (hW > 0 ? '<div class="bar-seg red" style="width:' + hW + 'px"></div>' : '')
      + (mW > 0 ? '<div class="bar-seg orange" style="width:' + mW + 'px"></div>' : '')
      + (lW > 0 ? '<div class="bar-seg green" style="width:' + Math.max(1, lW) + 'px"></div>' : '')
      + '</div>'
      + '<div class="tree-file-row2">'
      + '<span class="tree-nums">' + highs + ' &nbsp; ' + lows + '</span>'
      + '</div>';

    div.querySelector('.tree-file').addEventListener('click', () => selectFile(filePath));
    parent.appendChild(div);
  }

  function refreshActiveFile() {
    document.querySelectorAll('.tree-file').forEach(el => {
      const parent = el.closest('[data-file]');
      if (parent) {
        el.classList.toggle('active', parent.dataset.file === selectedFile);
      }
    });
    const fhFilename = document.getElementById('fh-filename');
    if (selectedFile) {
      const parts = selectedFile.replace(/\\\\/g, '/').split('/');
      fhFilename.textContent = parts[parts.length - 1];
    }
  }

  function selectFile(filePath) {
    selectedFile = filePath;
    expandedIdx  = 0;
    document.getElementById('file-filter').value = filePath;
    applyFilters();
    refreshActiveFile();
  }

  function toggleFolder(el) {
    const child = el.nextElementSibling;
    if (child) child.style.display = child.style.display === 'none' ? '' : 'none';
  }

  /* ─── Filters ─── */
  function filterSev(sev) {
    sevFilter = sev;
    ['high','medium','low','total'].forEach(k => document.getElementById('sc-' + k).classList.remove('active'));
    if (!sev) document.getElementById('sc-total').classList.add('active');
    else document.getElementById('sc-' + sev.toLowerCase()).classList.add('active');
    applyFilters();
  }

  function toggleAutofix() {
    autofixOnly = !autofixOnly;
    document.getElementById('autofix-toggle').style.background = autofixOnly ? 'var(--blue)' : 'var(--bg-3)';
    applyFilters();
  }

  function applyFilters() {
    const q       = (document.getElementById('search-input').value || '').toLowerCase().trim();
    const tabQ    = (document.getElementById('tab-search-input').value || '').toLowerCase().trim();
    const fileSel = document.getElementById('file-filter').value || selectedFile || '';
    const sort    = document.getElementById('sort-select').value;

    filtered = allResults.filter(r => {
      if (fileSel && getFileName(r) !== fileSel) return false;
      const name = getQueryName(r).toLowerCase();
      if (q && !name.includes(q)) return false;
      if (tabQ && !name.includes(tabQ)) return false;
      if (sevFilter && normSev(r) !== sevFilter) return false;
      return true;
    });

    const sevOrd = { HIGH: 0, MEDIUM: 1, LOW: 2, INFO: 3 };
    filtered.sort((a, b) => {
      if (sort === 'severity') return (sevOrd[normSev(a)] || 3) - (sevOrd[normSev(b)] || 3);
      if (sort === 'name')     return getQueryName(a).localeCompare(getQueryName(b));
      if (sort === 'file')     return getFileName(a).localeCompare(getFileName(b));
      if (sort === 'line')     return (getLine(a) || 0) - (getLine(b) || 0);
      return 0;
    });

    setTxt('fh-file-count', filtered.length);
    renderFindings();
  }

  /* ─── Render findings ─── */
  function renderFindings() {
    const container = document.getElementById('findings-scroll');

    if (filtered.length === 0) {
      container.innerHTML = '<div class="no-results">No findings match the current filter</div>';
      return;
    }

    container.innerHTML = '';

    filtered.forEach((r, i) => {
      if (i === expandedIdx) {
        container.appendChild(buildExpandedFinding(r, i));
      } else {
        container.appendChild(buildCompactFinding(r, i));
      }
    });
  }

  function buildExpandedFinding(r, i) {
    const sev    = normSev(r);
    const sc     = sevClass(sev);
    const name   = getQueryName(r);
    const nodes  = getNodes(r);
    const src    = getSourceNode(r);
    const file   = shortFile(getFileName(r));
    const line   = getLine(r);
    const srcCode = getCode(src);
    const hint   = getDescription(r) || 'Use parameterized queries to prevent injection attacks.';

    const wrap = document.createElement('div');
    wrap.className = 'fade-in';

    const pathBar = document.createElement('div');
    pathBar.className = 'finding-path-bar';
    pathBar.innerHTML =
      '<span class="path-check">&#x2714;</span>'
      + '<span class="path-label">Critical Path</span>'
      + '<span class="path-person">&#x1F464;</span>'
      + '<span class="path-arrow">&#x276F;</span>'
      + '<div class="path-file-chip"><span class="chip-dot">&#x25CF;</span>'
      + escHtml(file || name.slice(0,8).toUpperCase()) + ' <span class="chip-arrow">&#x25BE;</span></div>'
      + '<span class="path-arrow">&#x276F;</span>'
      + '<a class="path-link" onclick="openFile(allResults.indexOf(filtered[' + i + ']))">'
      + '<span>&#x1F517;</span> ' + escHtml(file)
      + '</a>'
      + '<span class="path-issues-badge">' + filtered.length + ' issues</span>'
      + '<span class="path-spacer"></span>'
      + '<div class="path-line-info">'
      + 'Line <span style="color:var(--text-1)">' + (line || '—') + '</span>'
      + '<div class="path-nav-btn">&#x276E;</div>'
      + '<div class="path-nav-btn">&#x276F;</div>'
      + 'line <span style="color:var(--text-1)">1</span>'
      + '<div class="path-nav-btn">&#x276F;</div>'
      + '</div>';

    const card = document.createElement('div');
    card.className = 'finding-card expanded';

    const header = document.createElement('div');
    header.className = 'finding-card-header';
    header.onclick = () => { expandedIdx = -1; renderFindings(); };

    header.innerHTML =
      '<div class="fc-sev-icon ' + sc + '">' + (sc === 'high' ? '11' : sc === 'medium' ? 'M' : 'L') + '</div>'
      + '<div class="fc-title">' + escHtml(name) + '</div>'
      + (sc === 'high' ? '<span class="fc-badge critical">Critical</span>' : '')
      + '<span class="fc-autofix-label">&#x1F511; Auto-Fix Available</span>'
      + '<span class="fc-line-info">line <span>' + (line || 1) + '</span></span>'
      + '<div class="fc-nav-btns">'
      + '<div class="fc-nav">&#x276E;</div>'
      + '<div class="fc-nav">&#x276F;</div>'
      + '</div>';

    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'finding-expanded';

    if (src) {
      const locBar = document.createElement('div');
      locBar.className = 'fe-location-bar';
      locBar.innerHTML = '<span class="fe-loc-dot"></span>'
        + '<span class="fe-loc-file">' + escHtml(file) + '</span>'
        + '<span class="fe-loc-nums">, <span class="fe-loc-num">' + (src.line || line || '—') + '</span>'
        + ' <span style="color:var(--text-3)">&#x1F464;</span>'
        + ' <span class="fe-loc-num">' + (nodes.length || 1) + '</span></span>';
      body.appendChild(locBar);
    }

    if (srcCode) {
      const codeBlock = document.createElement('div');
      codeBlock.className = 'fe-code-block';
      const codeLines = srcCode.split('\\n');
      const startLine = line || 1;
      codeBlock.innerHTML = codeLines.slice(0, 5).map((ln, ci) => {
        const num = startLine + ci;
        const isHL = ci === 0;
        return '<div class="code-ln' + (isHL ? ' hl' : '') + '">'
          + '<span class="code-ln-num">' + num + '</span>'
          + '<span class="code-ln-text">' + escHtml(ln) + '</span>'
          + '</div>';
      }).join('');
      body.appendChild(codeBlock);
    }

    const hintEl = document.createElement('div');
    hintEl.className = 'fe-hint';
    hintEl.innerHTML = '<span class="fe-hint-dot">&#x2022;</span><span>' + escHtml(hint.slice(0, 100)) + (hint.length > 100 ? '...' : '') + '</span>';
    body.appendChild(hintEl);

    const actions = document.createElement('div');
    actions.className = 'fe-actions';
    actions.innerHTML =
      '<button class="fe-btn fe-btn-ghost" onclick="analyzeItem(' + i + ')">Analyze</button>'
      + '<button class="fe-btn fe-btn-fix" onclick="fixItem(' + i + ')"><span class="fe-btn-fix-icon">&#x26A1;</span> Fix Issue <span style="font-size:10px;opacity:0.7;">&#x276F;</span></button>';
    body.appendChild(actions);

    card.appendChild(body);
    wrap.appendChild(pathBar);
    wrap.appendChild(card);
    return wrap;
  }

  function buildCompactFinding(r, i) {
    const sev  = normSev(r);
    const sc   = sevClass(sev);
    const name = getQueryName(r);
    const line = getLine(r);
    const file = shortFile(getFileName(r));

    const isOnProd = sev === 'MEDIUM' || sev === 'LOW';

    const div = document.createElement('div');
    div.className = 'finding-row sev-' + sc + ' fade-in';
    div.style.animationDelay = (i * 0.02) + 's';
    div.onclick = () => { expandedIdx = i; applyFilters(); };

    div.innerHTML =
      '<div class="fr-sev-icon ' + sc + '">' + (sc === 'high' ? '11' : sc === 'medium' ? 'M' : 'L') + '</div>'
      + '<div class="fr-title">' + escHtml(name) + '</div>'
      + (isOnProd && sev === 'MEDIUM' ? '<span class="fr-badge on-prod">&#x2714; on-Production</span>' : '')
      + '<span class="fr-line">Line <span>' + (line || '—') + '</span></span>'
      + '<div class="fr-nav-btns">'
      + '<div class="fr-nav">&#x276E;</div>'
      + '<div class="fr-nav">&#x276F;</div>'
      + '</div>'
      + '<span class="fr-sev-chip ' + sc + '">' + sev.toUpperCase() + '</span>'
      + '<div class="fr-nav">&#x276F;</div>';

    return div;
  }

  /* ─── Actions ─── */
  function openFile(rawIdx) {
    const r = allResults[rawIdx];
    if (!r) return;
    const src = getSourceNode(r) || {};
    vscode.postMessage({ type: 'OPEN_FILE', file: src.fileName || src.file || getFileName(r), line: src.line || getLine(r) || 0 });
  }

  function analyzeItem(i) {
    if (filtered[i]) vscode.postMessage({ type: 'ANALYZE_ISSUE', issue: filtered[i] });
  }

  function fixItem(i) {
    if (filtered[i]) fixWithCopilot(filtered[i]);
  }

  function fixWithCopilot(r) {
    const src = getSourceNode(r) || {};
    vscode.postMessage({
      type: 'COPILOT_FIX',
      payload: {
        fileName:    src.fileName || src.file || getFileName(r),
        code:        getCode(src) || getCode(getSinkNode(r)) || '',
        vulnerability: getQueryName(r),
        description: getDescription(r),
        cwe:         getCwe(r),
        severity:    normSev(r),
        nodes:       getNodes(r)
      }
    });
  }

  function analyzeSelected() { vscode.postMessage({ type: 'ANALYZE_SELECTED' }); }
  function fixSelected()     { vscode.postMessage({ type: 'FIX_SELECTED' }); }
  function analyzeAll()      { vscode.postMessage({ type: 'ANALYZE_ALL' }); }
  function fixAll()          { vscode.postMessage({ type: 'FIX_ALL' }); }
  function exportReport()    { vscode.postMessage({ type: 'EXPORT_REPORT', data: { scanId: currentScanId, results: allResults } }); }
  function newScan()         { vscode.postMessage({ type: 'NEW_SCAN' }); }

  /* ─── Field helpers ─── */
  function normSev(r) {
    const raw = (r.severity || r.data?.severity || '').toUpperCase();
    if (['CRITICAL','HIGH'].includes(raw)) return 'HIGH';
    if (raw === 'MEDIUM') return 'MEDIUM';
    if (raw === 'LOW')    return 'LOW';
    return 'INFO';
  }

  function sevClass(sev) {
    if (sev === 'HIGH')   return 'high';
    if (sev === 'MEDIUM') return 'medium';
    if (sev === 'LOW')    return 'low';
    return 'info';
  }

  function getQueryName(r)  { return r.queryName || r.data?.queryName || r.name || r.title || r.type || 'Unknown Vulnerability'; }
  function getFileName(r)   { const s = getSourceNode(r); return s?.fileName || s?.file || r.fileName || r.data?.fileName || r.file || ''; }
  function getLine(r)       { const s = getSourceNode(r); return s?.line || s?.lineNumber || r.line || r.data?.line || 0; }
  function getCwe(r)        { return r.cweId || r.data?.cweId || r.cwe || r.vulnerabilityId || ''; }
  function getDescription(r){ return r.resultDescription || r.description || r.data?.description || ''; }
  function getNodes(r)      { return r.nodes || r.data?.nodes || r.path || []; }
  function getSourceNode(r) { const n = getNodes(r); return n.length ? n[0] : null; }
  function getSinkNode(r)   { const n = getNodes(r); return n.length ? n[n.length - 1] : null; }
  function getCode(node)    { return node?.code || node?.snippet || node?.sourceCode || ''; }
  function shortFile(p)     { if (!p) return ''; const parts = p.replace(/\\\\/g,'/').split('/'); return parts.slice(-2).join('/'); }
  function escHtml(s)       { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function setTxt(id, v)    { const el = document.getElementById(id); if (el) el.textContent = v; }
  function showLoading()    { document.getElementById('loading-overlay').style.display = 'flex'; }
  function hideLoading()    { document.getElementById('loading-overlay').style.display = 'none'; }
  function setLoadingText(t){ const el = document.querySelector('.loading-text'); if (el) el.textContent = t; }

  /* ─── Demo data ─── */
  function getDemoData() {
    return [
      {
        queryName: 'SQL Injection Vulnerability',
        severity: 'HIGH',
        cweId: '89',
        resultDescription: 'Use parameterized queries to prevent SQL injection attacks. Unsanitized user input is concatenated directly into an SQL query.',
        nodes: [
          { name: 'req.query.id',  fileName: 'src/app.js', line: 42, code: 'const userId = req.query.id;\\nconst query = "SELECT" + " FROM : WHERE id = [\\"$\{userId\}\\"]";' },
          { name: 'db.query()',    fileName: 'src/app.js', line: 46, code: 'db.query(query)' }
        ]
      },
      {
        queryName: 'Cross-Site Scripting (XSS)',
        severity: 'HIGH',
        cweId: '79',
        resultDescription: 'User-controlled data flows directly into the HTML response without encoding.',
        nodes: [
          { name: 'req.query.name', fileName: 'src/app.js', line: 179, code: 'const name = req.query.name;' },
          { name: 'res.send()',     fileName: 'src/app.js', line: 183, code: 'res.send("<h1>Hello " + name + "</h1>");' }
        ]
      },
      {
        queryName: 'Hardcoded Password',
        severity: 'HIGH',
        cweId: '259',
        resultDescription: 'A hardcoded password was found in the source code.',
        nodes: [
          { name: 'password', fileName: 'src/auth.js', line: 91, code: 'const password = "admin123";' }
        ]
      },
      {
        queryName: 'Insecure Deserialization',
        severity: 'MEDIUM',
        cweId: '502',
        resultDescription: 'Deserializing untrusted data can lead to remote code execution.',
        nodes: [
          { name: 'JSON.parse()', fileName: 'src/auth.js', line: 108, code: 'const data = eval(input);' }
        ]
      },
      {
        queryName: 'Insufficient Input Validation',
        severity: 'MEDIUM',
        cweId: '20',
        resultDescription: 'Input is not properly validated before processing.',
        nodes: [
          { name: 'req.body', fileName: 'src/utils.py', line: 256, code: 'process(req.body.data)' }
        ]
      },
      {
        queryName: 'Path Traversal',
        severity: 'HIGH',
        cweId: '22',
        resultDescription: 'User-controlled input is used to construct a file path without validation.',
        nodes: [
          { name: 'req.params.file', fileName: 'src/utils.py', line: 15, code: 'const file = req.params.file;' },
          { name: 'fs.readFile()',   fileName: 'src/utils.py', line: 20, code: 'fs.readFile("/uploads/" + file, cb)' }
        ]
      },
      {
        queryName: 'Missing CSRF Protection',
        severity: 'LOW',
        cweId: '352',
        resultDescription: 'State-changing endpoints do not implement CSRF protection.',
        nodes: [
          { name: 'POST /delete', fileName: 'src/utils.py', line: 45, code: 'app.post("/delete", deleteHandler);' }
        ]
      },
      {
        queryName: 'Insecure Random',
        severity: 'MEDIUM',
        cweId: '330',
        resultDescription: 'Math.random() is not cryptographically secure.',
        nodes: [
          { name: 'Math.random()', fileName: 'src/utils.py', line: 8, code: 'const token = Math.random().toString(36);' }
        ]
      },
      {
        queryName: 'DB Migration Issue',
        severity: 'LOW',
        cweId: '200',
        resultDescription: 'Migration script contains sensitive data exposure.',
        nodes: [
          { name: 'migration', fileName: 'migrations/001_initial.sql', line: 2, code: 'ALTER TABLE users ADD COLUMN password TEXT;' }
        ]
      },
      {
        queryName: 'Weak Encryption',
        severity: 'MEDIUM',
        cweId: '327',
        resultDescription: 'MD5 is not suitable for password hashing.',
        nodes: [
          { name: 'md5()', fileName: 'migrations/001_initial.sql', line: 14, code: 'hash = md5(password)' }
        ]
      }
    ];
  }
</script>
</body>
</html>`;
}
