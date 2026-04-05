import { startMcpServer } from './server/mcpServer';
import { createLogger } from '@secure-scan/core';

const logger = createLogger('mcp-server');

async function main(): Promise<void> {
  logger.info('Starting Secure Scan MCP Server');
  try {
    await startMcpServer();
  } catch (err) {
    logger.error('Fatal error starting MCP server', err);
    process.exit(1);
  }
}

main();
