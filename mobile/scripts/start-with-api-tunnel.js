const { spawn } = require('child_process');
const net = require('net');
const localtunnel = require('localtunnel');

const DEFAULT_BACKEND_PORT = Number(process.env.RRMS_BACKEND_PORT || 7000);
const DEFAULT_BACKEND_HOST = process.env.RRMS_BACKEND_HOST || '127.0.0.1';
const DEFAULT_METRO_PORT = Number(process.env.RRMS_METRO_PORT || 8081);
const DEFAULT_METRO_HOST = process.env.RRMS_METRO_HOST || '127.0.0.1';
const DEFAULT_TUNNEL_HOST = process.env.RRMS_TUNNEL_HOST || 'https://localtunnel.me';
const DEFAULT_TUNNEL_VERIFY_PATH = process.env.RRMS_TUNNEL_VERIFY_PATH || '/authen/error';

function isWindows() {
  return process.platform === 'win32';
}

function quoteWindowsArg(arg) {
  if (!arg || /\s|"/.test(arg)) {
    return `"${String(arg).replace(/"/g, '\\"')}"`;
  }

  return String(arg);
}

function sanitizeExpoArgs(args) {
  const sanitized = [];
  let skippedIosFlag = false;

  for (const arg of args) {
    if (!skippedIosFlag && (arg === '--ios' || arg === '-i')) {
      skippedIosFlag = true;
      continue;
    }

    sanitized.push(arg);
  }

  return {
    args: sanitized,
    skippedIosFlag,
  };
}

function waitForBackend({ host, port, timeoutMs = 10000 }) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const onError = (error) => {
      socket.destroy();
      reject(error);
    };

    socket.setTimeout(timeoutMs);
    socket.once('error', onError);
    socket.once('timeout', () => onError(new Error(`Timed out connecting to ${host}:${port}`)));
    socket.connect(port, host, () => {
      socket.end();
      resolve();
    });
  });
}

function checkPortAvailable({ host, port, timeoutMs = 1000 }) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const finish = (available) => {
      try {
        socket.destroy();
      } catch {}
      resolve(available);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(false));
    socket.once('timeout', () => finish(true));
    socket.once('error', (error) => {
      if (error && (error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH')) {
        finish(true);
        return;
      }
      finish(false);
    });
    socket.connect(port, host);
  });
}

async function findAvailablePort({ host, startPort, maxAttempts = 20 }) {
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = startPort + offset;
    const available = await checkPortAvailable({ host, port });

    if (available) {
      return port;
    }
  }

  throw new Error(`Could not find an available port starting from ${startPort}.`);
}

async function openPublicTunnel({ host, port, tunnelHost }) {
  return localtunnel({
    port,
    local_host: host,
    host: tunnelHost,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyPublicApiTunnel(apiUrl, verifyPath = DEFAULT_TUNNEL_VERIFY_PATH) {
  const targetUrl = new URL(verifyPath, `${apiUrl}/`).toString();

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'bypass-tunnel-reminder': 'true',
          'user-agent': 'RRMS tunnel verifier',
        },
      });

      if (response.status < 500 || response.status === 401) {
        console.log(`[RRMS tunnel] API tunnel verified at ${targetUrl} (status ${response.status}).`);
        return;
      }

      console.warn(
        `[RRMS tunnel] API tunnel probe returned ${response.status} on attempt ${attempt}/6.`
      );
    } catch (error) {
      console.warn(
        `[RRMS tunnel] API tunnel probe failed on attempt ${attempt}/6: ${error?.message || error}`
      );
    }

    await sleep(500 * attempt);
  }

  throw new Error(
    `Public API tunnel is not responding at ${targetUrl}. The localtunnel endpoint may be unstable right now.`
  );
}

async function openVerifiedApiTunnel({ host, port, tunnelHost }) {
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const tunnel = await openPublicTunnel({ host, port, tunnelHost });

    try {
      console.log(`[RRMS tunnel] Verifying public API tunnel (attempt ${attempt}/3)...`);
      await verifyPublicApiTunnel(tunnel.url);
      return tunnel;
    } catch (error) {
      lastError = error;
      console.warn(`[RRMS tunnel] API tunnel verification failed: ${error?.message || error}`);

      try {
        tunnel.close();
      } catch {}

      await sleep(700 * attempt);
    }
  }

  throw lastError || new Error('Failed to open a healthy public API tunnel.');
}

function printBackendStartupHelp({ host, port }) {
  console.error(`[RRMS tunnel] Backend is not reachable at http://${host}:${port}.`);
  console.error('[RRMS tunnel] Start the backend first from the server folder, then run npm run start:tunnel again.');
  console.error('[RRMS tunnel] Recommended command on Windows:');
  console.error('[RRMS tunnel]   cd ..\\server && .\\run-dev.cmd');
}

async function main() {
  const args = process.argv.slice(2);
  const printUrlOnly = args.includes('--print-url');
  const rawExpoArgs = args.filter((arg) => arg !== '--print-url');
  const sanitizedExpoArgs = sanitizeExpoArgs(rawExpoArgs);
  const expoArgs = sanitizedExpoArgs.args;
  const backendHost = DEFAULT_BACKEND_HOST;
  const backendPort = DEFAULT_BACKEND_PORT;
  const metroHost = DEFAULT_METRO_HOST;
  const metroPort = await findAvailablePort({
    host: metroHost,
    startPort: DEFAULT_METRO_PORT,
  });

  console.log(`[RRMS tunnel] Checking backend at http://${backendHost}:${backendPort} ...`);
  await waitForBackend({ host: backendHost, port: backendPort });
  console.log(`[RRMS tunnel] Using Metro port ${metroPort}.`);

  console.log('[RRMS tunnel] Opening public API tunnel...');
  const apiTunnel = await openVerifiedApiTunnel({
    host: backendHost,
    port: backendPort,
    tunnelHost: DEFAULT_TUNNEL_HOST,
  });

  console.log('[RRMS tunnel] Opening public Metro tunnel...');
  const metroTunnel = await openPublicTunnel({
    host: metroHost,
    port: metroPort,
    tunnelHost: DEFAULT_TUNNEL_HOST,
  });

  const apiUrl = apiTunnel.url;
  const metroUrl = metroTunnel.url;
  let expoProcess = null;
  let cleaningUp = false;

  const cleanup = async (exitCode = 0) => {
    if (cleaningUp) {
      return;
    }
    cleaningUp = true;

    try {
      if (expoProcess && !expoProcess.killed) {
        expoProcess.kill('SIGINT');
      }
    } catch {}

    try {
      apiTunnel.close();
    } catch {}

    try {
      metroTunnel.close();
    } catch {}

    try {
      process.exit(exitCode);
    } catch {}
  };

  apiTunnel.on('error', async (error) => {
    console.error('[RRMS tunnel] API tunnel error:', error.message || error);
    await cleanup(1);
  });

  metroTunnel.on('error', async (error) => {
    console.error('[RRMS tunnel] Metro tunnel error:', error.message || error);
    await cleanup(1);
  });

  apiTunnel.on('close', async () => {
    if (!cleaningUp) {
      console.error('[RRMS tunnel] API tunnel closed unexpectedly.');
      await cleanup(1);
    }
  });

  metroTunnel.on('close', async () => {
    if (!cleaningUp) {
      console.error('[RRMS tunnel] Metro tunnel closed unexpectedly.');
      await cleanup(1);
    }
  });

  console.log(`[RRMS tunnel] Public API URL: ${apiUrl}`);
  console.log(`[RRMS tunnel] Public Metro URL: ${metroUrl}`);

  if (sanitizedExpoArgs.skippedIosFlag && process.platform !== 'darwin') {
    console.log(
      '[RRMS tunnel] Ignoring --ios because iOS Simulator/Xcode is only available on macOS. Keep Expo Go open on your iPhone and scan the QR code instead.'
    );
  }

  if (printUrlOnly) {
    cleaningUp = true;
    apiTunnel.close();
    metroTunnel.close();
    return;
  }

  const commandArgs = ['expo', 'start', '--localhost', '--port', String(metroPort), '-c', ...expoArgs];
  const command = isWindows() ? 'cmd.exe' : 'npx';
  const spawnArgs = isWindows()
    ? ['/d', '/s', '/c', `npx ${commandArgs.map(quoteWindowsArg).join(' ')}`]
    : commandArgs;

  console.log('[RRMS tunnel] Starting Expo with public tunnels for Metro and API...');
  console.log(`[RRMS tunnel] Command: ${command} ${spawnArgs.join(' ')}`);

  expoProcess = spawn(command, spawnArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      EXPO_PUBLIC_API_URL: apiUrl,
      EXPO_PACKAGER_PROXY_URL: metroUrl,
    },
  });

  expoProcess.on('exit', async (code) => {
    await cleanup(code ?? 0);
  });

  process.on('SIGINT', async () => {
    await cleanup(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup(0);
  });
}

main().catch((error) => {
  console.error('[RRMS tunnel] Failed to start tunnel workflow.');

  if (error?.code === 'ECONNREFUSED') {
    printBackendStartupHelp({
      host: DEFAULT_BACKEND_HOST,
      port: DEFAULT_BACKEND_PORT,
    });
  } else {
    console.error(error?.message || error);
  }

  process.exit(1);
});
