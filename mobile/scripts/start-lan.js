const { spawn } = require('child_process');
const net = require('net');
const os = require('os');

const DEFAULT_BACKEND_PORT = Number(process.env.RRMS_BACKEND_PORT || process.env.EXPO_PUBLIC_API_PORT || 7000);
const DEFAULT_METRO_PORT = Number(process.env.RRMS_METRO_PORT || 8081);

function isWindows() {
  return process.platform === 'win32';
}

function quoteWindowsArg(arg) {
  if (!arg || /\s|"/.test(arg)) {
    return `"${String(arg).replace(/"/g, '\\"')}"`;
  }

  return String(arg);
}

function getLanIpv4Candidates() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses || []) {
      if (address.family !== 'IPv4' || address.internal) {
        continue;
      }

      if (address.address.startsWith('169.254.')) {
        continue;
      }

      candidates.push({
        address: address.address,
        name,
        score:
          (/wi-?fi|wireless|wlan/i.test(name) ? 100 : 0) +
          (address.address.startsWith('192.168.1.') ? 40 : 0) +
          (address.address.startsWith('192.168.') ? 20 : 0) +
          (address.address.startsWith('10.') ? 10 : 0) -
          (/vmware|virtual|vEthernet|hyper-v|wsl|loopback/i.test(name) ? 80 : 0),
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
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

  throw new Error(`Could not find an available Metro port starting from ${startPort}.`);
}

function canConnect({ host, port, timeoutMs = 1200 }) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const finish = (ok) => {
      try {
        socket.destroy();
      } catch {}
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

async function main() {
  const lanCandidates = getLanIpv4Candidates();
  const lanHost = process.env.RRMS_LAN_HOST || lanCandidates[0]?.address;

  if (!lanHost) {
    throw new Error('No LAN IPv4 address was found. Connect the laptop to Wi-Fi, then run npm run start again.');
  }

  const metroPort = await findAvailablePort({
    host: '127.0.0.1',
    startPort: DEFAULT_METRO_PORT,
  });
  const apiUrl = `http://${lanHost}:${DEFAULT_BACKEND_PORT}`;
  const apiCandidates = [
    apiUrl,
    `http://127.0.0.1:${DEFAULT_BACKEND_PORT}`,
    `http://localhost:${DEFAULT_BACKEND_PORT}`,
  ].join(',');

  console.log(`[RRMS LAN] Selected LAN host: ${lanHost}`);
  console.log(`[RRMS LAN] Metro URL for Expo Go: exp://${lanHost}:${metroPort}`);
  console.log(`[RRMS LAN] API URL for phone: ${apiUrl}`);

  const backendReachable = await canConnect({ host: lanHost, port: DEFAULT_BACKEND_PORT });
  if (!backendReachable) {
    const localReachable = await canConnect({ host: '127.0.0.1', port: DEFAULT_BACKEND_PORT });
    if (localReachable) {
      console.warn(`[RRMS LAN] Backend is running locally but not reachable through ${apiUrl}. Check Windows Firewall inbound rule for port ${DEFAULT_BACKEND_PORT}.`);
    } else {
      console.warn(`[RRMS LAN] Backend is not running on port ${DEFAULT_BACKEND_PORT}. Start the server before testing API screens.`);
    }
  }

  const rawExpoArgs = process.argv.slice(2);
  const shouldClearCache =
    !rawExpoArgs.includes('--no-clear') &&
    !rawExpoArgs.includes('--clear') &&
    !rawExpoArgs.includes('-c');
  const expoArgs = [
    'expo',
    'start',
    '--host',
    'lan',
    '--port',
    String(metroPort),
    ...(shouldClearCache ? ['-c'] : []),
    ...rawExpoArgs.filter((arg) => arg !== '--no-clear'),
  ];
  const command = isWindows() ? 'cmd.exe' : 'npx';
  const spawnArgs = isWindows()
    ? ['/d', '/s', '/c', `npx ${expoArgs.map(quoteWindowsArg).join(' ')}`]
    : expoArgs;

  const child = spawn(command, spawnArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      EXPO_PUBLIC_API_URL: apiUrl,
      EXPO_PUBLIC_API_URL_CANDIDATES: apiCandidates,
      EXPO_PUBLIC_API_PORT: String(DEFAULT_BACKEND_PORT),
      REACT_NATIVE_PACKAGER_HOSTNAME: lanHost,
    },
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error('[RRMS LAN] Failed to start Expo LAN workflow.');
  console.error(error?.message || error);
  process.exit(1);
});
