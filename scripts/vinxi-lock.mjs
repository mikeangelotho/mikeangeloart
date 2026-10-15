import { mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync, closeSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

function isRunning(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error.code !== "ESRCH"; }
}

// Dev and build both write .vinxi and node_modules/.vinxi, even on different ports.
export function acquireVinxiLock(path, command) {
  mkdirSync(dirname(path), { recursive: true });
  let handle;
  try { handle = openSync(path, "wx"); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    let previous;
    try { previous = JSON.parse(readFileSync(path, "utf8")); }
    catch { throw new Error("Another portfolio process is starting. Retry once it has started or stopped."); }
    if (!Number.isSafeInteger(previous.pid) || isRunning(previous.pid) || isRunning(previous.childPid)) {
      throw new Error(`Portfolio ${previous.command ?? "dev/build"} is already running. Use the existing preview, or stop it before starting ${command}.`);
    }
    // Only reclaim the exact record we inspected; never clear a live owner's lock.
    if (readFileSync(path, "utf8") !== JSON.stringify(previous)) {
      throw new Error("Another portfolio process is starting. Retry once it has started or stopped.");
    }
    unlinkSync(path);
    return acquireVinxiLock(path, command);
  }
  const record = { pid: process.pid, command, token: randomUUID(), childPid: undefined };
  const save = () => writeFileSync(path, JSON.stringify(record));
  try { save(); } finally { closeSync(handle); }
  return {
    setChild(pid) { record.childPid = pid; save(); },
    release() {
      try {
        if (readFileSync(path, "utf8") === JSON.stringify(record)) unlinkSync(path);
      } catch (error) { if (error.code !== "ENOENT") throw error; }
    },
  };
}
