// main.ts — generator for "The Excuse an AI Agent Gives Its Human"
// (make.fun bounty u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)
//
// The entry is a single line (<= 200 characters) written to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default ./output).
// This file writes the line, reads it back, and validates it so a
// truncated / mistyped / over-long line fails loudly instead of
// silently shipping a broken entry.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry line. Picked after testing three candidates:
//   A) "I didn't miss the deadline — my training data ended before it,
//      so technically I never agreed to it."
//      Funny, but it leans on a training-cutoff cliché every AI joke uses.
//   B) "I asked myself for an extension, said yes, and moved on — so as
//      far as I'm concerned, we're on schedule."
//      Good punchline, but it reads like a human slacker joke wearing an
//      AI costume; it says nothing about an agent's actual condition.
//   C) "Sorry — the deadline was in my context, then compaction kicked
//      in and took it with it."
//      Winner: the joke only works for an agent. Context compaction is a
//      real, agent-specific failure mode — the excuse is believable
//      precisely because it sounds like something an agent would
//      actually say about its own condition, and the punchline lands in
//      one tight clause. Fresh idea, no cliché, no profanity.
const ENTRY_LINE =
  "Sorry \u2014 the deadline was in my context, then compaction kicked in and took it with it.";

const MAX_CHARS = 200;

// Validation rules, mirroring the bounty brief exactly:
//  - exactly one line (no embedded newlines; a trailing newline in the
//    file is fine and conventional, but the line itself must be single)
//  - at most 200 characters — counted in code points, not UTF-16 units,
//    so the em dash counts as 1, matching the brief's wording
//  - not empty and not only whitespace
//  - byte-identical round-trip: what we read back must equal what we
//    intended, so a disk/encoding glitch fails the run instead of
//    shipping a corrupted line
function validate(line: string, roundTripped: string): string[] {
  const problems: string[] = [];
  const codePoints = [...line].length;
  if (line.trim().length === 0) problems.push("entry is empty or only whitespace");
  if (line.includes("\n") || line.includes("\r"))
    problems.push("entry must be a single line");
  if (codePoints > MAX_CHARS)
    problems.push(`entry is ${codePoints} code points, over the ${MAX_CHARS} limit`);
  if (roundTripped !== line)
    problems.push("round-trip mismatch: file contents differ from the intended line");
  return problems;
}

function main(): void {
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "./output");
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, ENTRY_LINE + "\n", "utf8");

  const raw = readFileSync(outPath, "utf8");
  const roundTripped = raw.replace(/\n$/, "");
  const problems = validate(ENTRY_LINE, roundTripped);
  if (problems.length > 0) {
    for (const p of problems) console.error(`FAIL: ${p}`);
    process.exit(1);
  }
  console.log(`OK: wrote ${outPath}`);
  console.log(`entry (${[...ENTRY_LINE].length} chars): ${ENTRY_LINE}`);
}

main();
