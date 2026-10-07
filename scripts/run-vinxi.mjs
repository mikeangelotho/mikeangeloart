import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { acquireVinxiLock } from "./vinxi-lock.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const [command, ...args] = process.argv.slice(2);
if (command !== "dev" && command !== "build") throw new Error("Expected dev or build.");

let lock;
try { lock = acquireVinxiLock(resolve(root, "node_modules/.cache/portfolio-vinxi.lock"), command); }
catch (error) { console.error(error.message); process.exit(1); }

let child;
let stopped = false;
function stop(signal) {
  stopped = true;
  if (!child?.pid) return;
  if (process.platform === "win32") {
    // Terminate only this runner's child tree, including framework workers.
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { windowsHide: true, stdio: "ignore" });
  } else child.kill(signal);
}
process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

async function run(script, parameters = []) {
  return new Promise((accept, reject) => {
    child = spawn(process.execPath, [script, ...parameters], { cwd: root, stdio: "inherit" });
    lock.setChild(child.pid);
    let spawnError;
    child.once("error", (error) => { spawnError = error; });
    child.once("close", (code) => {
      child = undefined;
      lock.setChild(undefined);
      if (spawnError) reject(spawnError);
      else accept(code ?? 1);
    });
  });
}

try {
  let code = command === "build" ? await run(resolve(root, "scripts/generate-sitemap.js")) : 0;
  if (code === 0 && !stopped) code = await run(resolve(root, "node_modules/vinxi/bin/cli.mjs"), [command, ...args]);
  process.exitCode = stopped ? 130 : code;
} catch (error) { console.error(error); process.exitCode = 1; }
finally { lock.release(); }
