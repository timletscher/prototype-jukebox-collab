const base = "http://localhost:3000";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  for (let i = 0; i < 15; i += 1) {
    try {
      const res = await fetch(`${base}/api/queue`);
      if (res.ok) {
        console.log("server ready");
        return true;
      }
    } catch (err) {
      // ignore and retry
    }
    console.log("waiting for server...");
    await sleep(1000);
  }
  return false;
}

async function readBody(res) {
  const text = await res.text();
  return { status: res.status, text };
}

const ready = await waitForServer();
if (!ready) {
  console.log("server not ready; aborting");
  process.exit(1);
}

console.log("---- POST /api/queue (add item) ----");
let res = await fetch(`${base}/api/queue`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "smoke test song", addedBy: "copilot" }),
});
let out = await readBody(res);
console.log(out.text);
console.log(`HTTP_CODE:${out.status}`);

console.log("---- GET /api/queue (list) ----");
res = await fetch(`${base}/api/queue`);
out = await readBody(res);
console.log(out.text);
console.log(`HTTP_CODE:${out.status}`);

let id = "";
try {
  const parsed = JSON.parse(out.text);
  if (Array.isArray(parsed) && parsed.length) {
    id = parsed[0].id || parsed[0].ID || parsed[0].Id || "";
  }
} catch {
  // ignore
}
console.log(`ID=[${id}]`);

if (id) {
  console.log("---- DELETE /api/queue/:id ----");
  res = await fetch(`${base}/api/queue/${id}`, { method: "DELETE" });
  out = await readBody(res);
  console.log(out.text);
  console.log(`HTTP_CODE:${out.status}`);
} else {
  console.log("No ID found; skipping delete.");
}

console.log("---- POST /api/queue/clear ----");
res = await fetch(`${base}/api/queue/clear`, { method: "POST" });
out = await readBody(res);
console.log(out.text);
console.log(`HTTP_CODE:${out.status}`);

console.log("---- GET /api/queue (final) ----");
res = await fetch(`${base}/api/queue`);
out = await readBody(res);
console.log(out.text);
console.log(`HTTP_CODE:${out.status}`);
