/**
 * Frees the dev port before `next dev` starts.
 *
 * Next won't reuse a port that's already bound: it falls back to 3001, 3002…
 * and then refuses when it detects another dev server for the same project.
 * That leaves stale servers running and the app on an unpredictable port, so
 * this kills whatever is listening and hands 3000 back every time.
 *
 * Usage: `node scripts/free-port.mjs [port]` (defaults to 3000).
 */
import { execSync } from 'child_process';

const port = process.argv[2] || process.env.PORT || '3000';
const isWindows = process.platform === 'win32';

/** PIDs listening on `port`, or [] when the port is free. */
function findPids() {
  try {
    if (isWindows) {
      // `netstat -ano` is available on every Windows box; PowerShell's
      // Get-NetTCPConnection is not (it's absent in some minimal installs).
      const out = execSync(`netstat -ano -p tcp`, { encoding: 'utf8' });
      return [
        ...new Set(
          out
            .split('\n')
            .filter((line) => /LISTENING/i.test(line) && line.includes(`:${port} `))
            .map((line) => line.trim().split(/\s+/).pop())
            .filter((pid) => pid && pid !== '0')
        ),
      ];
    }
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    // Both commands exit non-zero when nothing matches, which is the common case.
    return [];
  }
}

const pids = findPids();

if (!pids.length) {
  console.log(`[free-port] ${port} is free.`);
} else {
  for (const pid of pids) {
    // Never kill ourselves, however unlikely that match is.
    if (pid === String(process.pid)) continue;
    try {
      execSync(isWindows ? `taskkill /PID ${pid} /F /T` : `kill -9 ${pid}`, {
        stdio: 'ignore',
      });
      console.log(`[free-port] Freed ${port} (stopped PID ${pid}).`);
    } catch {
      console.warn(
        `[free-port] Could not stop PID ${pid} holding ${port}. ` +
          `It may belong to another user or need elevated permissions.`
      );
    }
  }
}
