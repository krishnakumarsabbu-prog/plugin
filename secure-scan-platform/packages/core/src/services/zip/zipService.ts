import * as path from 'path';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { createLogger } from '../../utils/logger';
import { ZipError } from '../../utils/errors';
import { ensureDir, generateTempPath } from '../../utils/paths';
import { envConfig } from '../../config/env';
import { ZipResult } from '../../types/common';

const logger = createLogger('zipService');

export interface ZipManifest {
  repoName: string;
  branch: string;
  scanMode: string;
  timestamp: string;
  files: string[];
}

export interface CreateZipOptions {
  files: Array<{ relativePath: string; absolutePath: string; content?: string }>;
  manifest: ZipManifest;
  outputDir?: string;
}

export async function createCheckmarxZip(options: CreateZipOptions): Promise<ZipResult> {
  const outputDir = options.outputDir ?? envConfig.tempZipDir;
  ensureDir(outputDir);

  const zipPath = generateTempPath(outputDir, 'cx-scan', '.zip');
  const manifestPath = generateTempPath(outputDir, 'manifest', '.json');

  fs.writeFileSync(manifestPath, JSON.stringify(options.manifest, null, 2));

  logger.info(`Creating ZIP at ${zipPath} with ${options.files.length} files`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver.default('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    for (const file of options.files) {
      if (file.content !== undefined) {
        archive.append(file.content, { name: file.relativePath });
      } else if (fs.existsSync(file.absolutePath)) {
        archive.file(file.absolutePath, { name: file.relativePath });
      } else {
        logger.warn(`File not found, skipping: ${file.absolutePath}`);
      }
    }

    archive.append(JSON.stringify(options.manifest, null, 2), { name: 'manifest.json' });
    archive.finalize();
  });

  logger.info(`ZIP created: ${zipPath}`);
  return {
    zipPath,
    fileCount: options.files.length,
    manifestPath,
  };
}
