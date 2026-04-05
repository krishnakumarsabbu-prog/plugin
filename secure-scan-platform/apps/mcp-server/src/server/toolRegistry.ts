import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getGitChangedFilesTool, runGetGitChangedFiles } from '../tools/getGitChangedFiles';
import { createCheckmarxZipTool, runCreateCheckmarxZip } from '../tools/createCheckmarxZip';
import { runCheckmarxScanTool, runRunCheckmarxScan } from '../tools/runCheckmarxScan';
import { getCheckmarxScanResultsTool, runGetCheckmarxScanResults } from '../tools/getCheckmarxScanResults';
import { getFilesForFindingsTool, runGetFilesForFindings } from '../tools/getFilesForFindings';
import { applyPatchToFilesTool, runApplyPatchToFiles } from '../tools/applyPatchToFiles';

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

const toolHandlers = new Map<string, ToolHandler>();

export function registerTools(): Tool[] {
  const tools: Tool[] = [
    getGitChangedFilesTool,
    createCheckmarxZipTool,
    runCheckmarxScanTool,
    getCheckmarxScanResultsTool,
    getFilesForFindingsTool,
    applyPatchToFilesTool,
  ];

  toolHandlers.set('get_git_changed_files', runGetGitChangedFiles);
  toolHandlers.set('create_checkmarx_zip', runCreateCheckmarxZip);
  toolHandlers.set('run_checkmarx_scan', runRunCheckmarxScan);
  toolHandlers.set('get_checkmarx_scan_results', runGetCheckmarxScanResults);
  toolHandlers.set('get_files_for_findings', runGetFilesForFindings);
  toolHandlers.set('apply_patch_to_files', runApplyPatchToFiles);

  return tools;
}

export async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  const handler = toolHandlers.get(name);
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return handler(args);
}
