/* eslint-disable @typescript-eslint/no-require-imports */
// this fixed errors introduced after we added the wix stuff, perhaps it can be removed in the future?
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const lockPath = path.join(os.tmpdir(), 'ugrc-api-client-kms-sign.lock');
const certPath = path.resolve(__dirname, '..', 'build', 'cert', 'windows.cer');
const timestampServer = 'http://timestamp.sectigo.com';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveKmsKeyPath = () => {
  const ring = (process.env.GCP_KEYRING_PATH || '').trim();
  const keyName = (process.env.GCP_KEY_NAME || '').trim();

  if (!ring) {
    throw new Error('GCP_KEYRING_PATH environment variable is not set');
  }

  return `${ring}/cryptoKeys/${keyName}/cryptoKeyVersions/1`;
};

const resolveSignToolPath = async () => {
  if (process.env.WINDOWS_SIGNTOOL_PATH) {
    return process.env.WINDOWS_SIGNTOOL_PATH;
  }

  const sdkBinRoot = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin';

  try {
    const versions = await fsp.readdir(sdkBinRoot, { withFileTypes: true });
    const candidates = versions
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(sdkBinRoot, entry.name, 'x64', 'signtool.exe'))
      .filter((candidate) => fs.existsSync(candidate))
      .sort()
      .reverse();

    if (candidates.length > 0) {
      return candidates[0];
    }
  } catch {
    // Fall back to PATH lookup below.
  }

  return 'signtool.exe';
};

const acquireLock = async () => {
  const deadline = Date.now() + 10 * 60 * 1000;

  while (Date.now() < deadline) {
    try {
      return await fsp.open(lockPath, 'wx');
    } catch (error) {
      if (error && error.code !== 'EEXIST') {
        throw error;
      }

      try {
        const stats = await fsp.stat(lockPath);

        if (Date.now() - stats.mtimeMs > 10 * 60 * 1000) {
          await fsp.unlink(lockPath);
          continue;
        }
      } catch {
        // The lock may have been released between stat attempts.
      }

      await sleep(500);
    }
  }

  throw new Error('Timed out waiting for the Windows signing lock');
};

const runSigntool = async (fileToSign) => {
  const signToolPath = await resolveSignToolPath();
  const kmsKeyPath = resolveKmsKeyPath();
  const args = [
    'sign',
    '/v',
    '/fd',
    'SHA256',
    '/tr',
    timestampServer,
    '/td',
    'SHA256',
    '/f',
    certPath,
    '/csp',
    'Google Cloud KMS Provider',
    '/kc',
    kmsKeyPath,
    fileToSign,
  ];

  await new Promise((resolve, reject) => {
    const child = spawn(signToolPath, args, {
      cwd: process.cwd(),
      env: process.env,
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          [
            `signtool exited with code ${code}`,
            `tool: ${signToolPath}`,
            `file: ${fileToSign}`,
            `stdout: ${stdout.trim() || '<empty>'}`,
            `stderr: ${stderr.trim() || '<empty>'}`,
          ].join('\n'),
        ),
      );
    });
  });
};

module.exports = async function signFile(fileToSign) {
  const handle = await acquireLock();

  try {
    await runSigntool(fileToSign);
  } finally {
    await handle.close();
    await fsp.unlink(lockPath).catch(() => undefined);
  }
};
