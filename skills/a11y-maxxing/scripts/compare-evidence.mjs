#!/usr/bin/env node
// Compare a before/after pair of axe result files with stable semantics:
// findings are keyed by result class + rule + target, `violations` and
// `incomplete` stay separate, and any added finding fails the run so
// completion can never be reduced to an aggregate count.

import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`compare-evidence: ${message}`);
  process.exit(2);
}

function loadFindings(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    fail(`cannot read ${path}: ${error.message}`);
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    fail(`${path} is not valid JSON`);
  }

  // Official axe CLI emits an array of result objects (one per URL);
  // axe-core emits a single result object.
  const results = Array.isArray(json) ? json : [json];
  if (results.length === 0) fail(`${path} contains no axe results`);

  const findings = new Map();
  for (const result of results) {
    const isAxeResult =
      result !== null &&
      typeof result === "object" &&
      Array.isArray(result.violations) &&
      Array.isArray(result.incomplete);
    if (!isAxeResult) {
      fail(
        `${path}: expected axe result object(s) with "violations" and "incomplete" arrays`,
      );
    }

    for (const resultClass of ["violations", "incomplete"]) {
      for (const rule of result[resultClass]) {
        const nodes = Array.isArray(rule.nodes) && rule.nodes.length > 0 ? rule.nodes : [{}];
        for (const node of nodes) {
          const target = Array.isArray(node.target)
            ? node.target.join(" ")
            : String(node.target ?? "(no target)");
          findings.set(`${resultClass}|${rule.id}|${target}`, {
            resultClass,
            rule: rule.id,
            impact: rule.impact ?? "none",
            target,
          });
        }
      }
    }
  }
  return findings;
}

function printGroup(label, findings) {
  console.log(`${label}: ${findings.length}`);
  const groups = new Map();
  for (const finding of findings) {
    const group = `${finding.resultClass} / ${finding.impact}`;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(`${finding.rule} @ ${finding.target}`);
  }
  for (const [group, items] of groups) {
    console.log(`  ${group}`);
    for (const item of items) console.log(`    ${item}`);
  }
}

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  fail("usage: compare-evidence.mjs <before.json> <after.json>");
}

const before = loadFindings(beforePath);
const after = loadFindings(afterPath);

const added = [...after].filter(([key]) => !before.has(key)).map(([, v]) => v);
const resolved = [...before].filter(([key]) => !after.has(key)).map(([, v]) => v);
const unchanged = [...after].filter(([key]) => before.has(key)).map(([, v]) => v);

printGroup("added", added);
printGroup("resolved", resolved);
printGroup("unchanged", unchanged);

process.exit(added.length > 0 ? 1 : 0);
