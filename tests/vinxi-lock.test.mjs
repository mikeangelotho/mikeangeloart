import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, rmSync, rmdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { acquireVinxiLock } from "../scripts/vinxi-lock.mjs";

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-lock-"));
  t.after(() => { rmSync(join(dir, "vinxi.lock"), { force: true }); rmdirSync(dir); });
  return join(dir, "vinxi.lock");
}

test("dev and build cannot write the same checkout concurrently", (t) => {
  const path = fixture(t);
  const dev = acquireVinxiLock(path, "dev");
  assert.throws(() => acquireVinxiLock(path, "dev"), /already running/);
  assert.throws(() => acquireVinxiLock(path, "build"), /already running/);
  dev.release();
  assert.equal(existsSync(path), false);
  const build = acquireVinxiLock(path, "build");
  build.release();
});

test("a terminated runner's lock is recovered", (t) => {
  const path = fixture(t);
  const deadPid = Number(spawnSync(process.execPath, ["-e", "console.log(process.pid)"], { encoding: "utf8" }).stdout.trim());
  assert.ok(deadPid > 0);
  writeFileSync(path, JSON.stringify({ pid: deadPid, command: "dev" }));
  const lock = acquireVinxiLock(path, "build");
  lock.release();
});

test("a surviving child keeps a terminated runner's checkout locked", (t) => {
  const path = fixture(t);
  const deadPid = Number(spawnSync(process.execPath, ["-e", "console.log(process.pid)"], { encoding: "utf8" }).stdout.trim());
  writeFileSync(path, JSON.stringify({ pid: deadPid, childPid: process.pid, command: "dev" }));
  assert.throws(() => acquireVinxiLock(path, "build"), /already running/);
});

test("releasing an older lock cannot remove a new owner's lock", (t) => {
  const path = fixture(t);
  const first = acquireVinxiLock(path, "dev");
  first.release();
  const second = acquireVinxiLock(path, "dev");
  first.release();
  assert.throws(() => acquireVinxiLock(path, "build"), /already running/);
  second.release();
});
