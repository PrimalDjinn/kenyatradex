import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";
import { digestEmail, signPipelineBody } from "../server/utils/newsletter.ts";

describe("newsletter pipeline", () => {
  it("signs pipeline requests with timestamped HMAC-SHA256", () => {
    const body = '{"forceDigest":false}';
    const timestamp = "1784505600";
    const secret = "test-pipeline-secret";
    const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("base64url");

    assert.equal(signPipelineBody(body, timestamp, secret), expected);
  });

  it("escapes publication content in digest emails", () => {
    const html = digestEmail(
      [
        {
          articleId: "blog/test",
          version: 1,
          title: "<Customs & Freight>",
          subject: "Test",
          summary: 'Avoid <script>alert("x")</script>',
          url: "https://kenyatradex.africa/blog/test.html",
        },
      ],
      "https://kenyatradex.africa/api/newsletter/unsubscribe?token=test",
    );

    assert.match(html, /&lt;Customs &amp; Freight&gt;/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /Unsubscribe/);
  });

  it("extracts recursive publications and YAML block summaries", () => {
    const directory = mkdtempSync(join(tmpdir(), "newsletter-publications-"));
    const blogDirectory = join(directory, "content/blog/guides");
    mkdirSync(blogDirectory, { recursive: true });
    writeFileSync(
      join(blogDirectory, "test.md"),
      `---
title: Test customs guide
description: Fallback description
path: /blog/guides/test.html
newsletterVersion: 2
newsletterSummary: >-
  A multiline customs summary
  for subscribers.
---
Article
`,
    );

    try {
      const output = execFileSync(process.execPath, [resolve("scripts/newsletter-publications.mjs")], {
        cwd: directory,
        env: { ...process.env, DEPLOY_SHA: "test-sha" },
        encoding: "utf8",
      });
      const result = JSON.parse(output) as { publications: Array<Record<string, unknown>> };
      assert.equal(result.publications[0]?.articleId, "blog/guides/test");
      assert.equal(result.publications[0]?.summary, "A multiline customs summary for subscribers.");
      assert.equal(result.publications[0]?.version, 2);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
