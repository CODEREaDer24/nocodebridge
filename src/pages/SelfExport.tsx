// NoCodeBridge Self-Extractor – BridgeCore Classic Revival
// Version Lock: 1.9  |  Author: Ciaran G. & Chad G. Petit
// ⚠️  Private build – do NOT share or refactor.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAs } from "file-saver";

declare global {
  interface Window {
    __LOVABLE_APP__?: any;
  }
}

export default function SelfExport() {
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const ADMIN_KEY = "bridge-admin-lock";

  function unlock() {
    if (password === localStorage.getItem(ADMIN_KEY)) setConfirmed(true);
    else alert("Invalid password");
  }

  function setNewPass() {
    localStorage.setItem(ADMIN_KEY, password);
    setConfirmed(true);
  }

  // ---------------- Deep Capture Core ----------------
  async function captureApp() {
    const appRoot = window.__LOVABLE_APP__ || {};
    const walk = (obj: any, path: string[] = []): any => {
      let data: any = {};
      for (const key in obj) {
        const val = obj[key];
        const type = typeof val;
        if (type === "function") data[key] = "[function]";
        else if (type === "object" && val !== null) data[key] = walk(val, [...path, key]);
        else data[key] = val;
      }
      return data;
    };

    const deepData = walk(appRoot);
    const timestamp = new Date().toISOString();

    const readingGuide = {
      aiGuide: "This export contains structure, props, and traversal metadata. Read recursively; ignore [function] stubs.",
      generator: "BridgeCore Classic 1.9",
      created: timestamp
    };

    const payload = { meta: readingGuide, data: deepData };
    const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const mdBlob = new Blob(
      [`# NoCodeBridge Export\n\nGenerated ${timestamp}\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``],
      { type: "text/markdown" }
    );
    const uapBlob = new Blob([JSON.stringify({ uapVersion: "2.0", payload })], { type: "application/octet-stream" });

    saveAs(jsonBlob, "NoCodeBridge-schema.json");
    saveAs(mdBlob, "NoCodeBridge-export.md");
    saveAs(uapBlob, "NoCodeBridge-uap-v2.0.uap");
    alert("✅ Full self-extract complete – 100% BridgeCore snapshot saved locally.");
  }

  // ---------------- Render ----------------
  if (!localStorage.getItem(ADMIN_KEY))
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Set Self-Extractor Password</h2>
        <Input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button onClick={setNewPass}>Save & Unlock</Button>
      </div>
    );

  if (!confirmed)
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Enter Password</h2>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button onClick={unlock}>Unlock</Button>
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">BridgeCore Classic Self-Extractor</h1>
      <p className="text-sm text-muted-foreground">
        Generates JSON + Markdown + UAP v2.0 locally. No credit usage.
      </p>
      <Button onClick={captureApp}>🧩 Run Full Extraction</Button>
    </div>
  );
}
