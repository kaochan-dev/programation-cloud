const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = 9000;
const SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";
const LOG_FILE = path.join(__dirname, "webhook-events.log");
const PIPELINE_SCRIPT = path.join(__dirname, "pipeline.sh");

app.use("/github-webhook", express.raw({ type: "application/json" }));

function logLine(message) {
  fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`);
}

function verifySignature(rawBody, signatureHeader) {
  if (!SECRET || !signatureHeader) return false;

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex");

  const a = Buffer.from(signatureHeader, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

app.post("/github-webhook", (req, res) => {
  const event = req.header("X-GitHub-Event") || "";
  const deliveryId = req.header("X-GitHub-Delivery") || "unknown";
  const signature = req.header("X-Hub-Signature-256") || "";
  const rawBody = req.body;

  if (!verifySignature(rawBody, signature)) {
    logLine(`REJECT delivery=${deliveryId} reason=bad-signature`);
    return res.status(401).send("invalid signature");
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    logLine(`REJECT delivery=${deliveryId} reason=bad-json`);
    return res.status(400).send("invalid json");
  }

  const ref = payload.ref || "";
  logLine(`EVENT delivery=${deliveryId} event=${event} ref=${ref}`);

  if (event === "push" && ref === "refs/heads/main") {
    const child = spawn("bash", [PIPELINE_SCRIPT], {
      cwd: __dirname,
      detached: true,
      stdio: "ignore",
      env: process.env,
    });
    child.unref();
    logLine(`PIPELINE_TRIGGERED delivery=${deliveryId}`);
  }

  return res.status(202).send("accepted");
});

app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

app.listen(PORT, () => {
  logLine(`Webhook server listening on port ${PORT}`);
  console.log(`Webhook server listening on port ${PORT}`);
});
