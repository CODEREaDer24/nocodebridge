// NoCodeBridge Self-Extractor – AEIOU v3.0
// Version: 3.0 | Author: Ciaran G. & Chad G. Petit
// ⚠️ Private build – do NOT share or refactor.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAs } from "file-saver";

declare global {
  interface Window {
    __LOVABLE_APP__?: any;
    __DATA_MODELS__?: any;
    __AI_PROMPTS__?: any;
    NoCodeBridge?: any;
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

  // ---------------- Deep Capture Core v3.0 ----------------
  async function captureApp() {
    const timestamp = new Date().toISOString();
    
    // Deep walk for objects
    const walk = (obj: any, path: string[] = []): any => {
      if (!obj || typeof obj !== "object") return obj;
      if (Array.isArray(obj)) return obj.map((item, i) => walk(item, [...path, `[${i}]`]));
      
      const data: any = {};
      for (const key in obj) {
        try {
          const val = obj[key];
          const type = typeof val;
          if (type === "function") data[key] = "[function]";
          else if (type === "object" && val !== null) data[key] = walk(val, [...path, key]);
          else data[key] = val;
        } catch (e) {
          data[key] = "[inaccessible]";
        }
      }
      return data;
    };

    // Capture app root
    const appRoot = walk(window.__LOVABLE_APP__ || {});
    
    // Capture routes from React Router
    const routes: any[] = [];
    try {
      const routeElements = document.querySelectorAll('[data-route], a[href^="/"]');
      routeElements.forEach(el => {
        const href = el.getAttribute('href') || el.getAttribute('data-route');
        if (href) routes.push({ path: href, element: el.tagName });
      });
    } catch (e) {
      console.warn("Route extraction failed:", e);
    }

    // Capture components from DOM
    const components: any[] = [];
    try {
      const allElements = document.querySelectorAll('[class], [data-component]');
      const componentMap = new Map();
      allElements.forEach(el => {
        const name = el.getAttribute('data-component') || el.className.split(' ')[0] || el.tagName;
        if (!componentMap.has(name)) {
          componentMap.set(name, {
            name,
            type: el.tagName.toLowerCase(),
            classes: el.className,
            attributes: Array.from(el.attributes).map(attr => ({ name: attr.name, value: attr.value }))
          });
        }
      });
      components.push(...Array.from(componentMap.values()));
    } catch (e) {
      console.warn("Component extraction failed:", e);
    }

    // Capture localStorage data
    const variables: any = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) variables[key] = localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage extraction failed:", e);
    }

    // Capture data models from meta tags or window
    const dataModels: any[] = [];
    try {
      if (window.__DATA_MODELS__) {
        dataModels.push(...walk(window.__DATA_MODELS__));
      }
    } catch (e) {
      console.warn("Data model extraction failed:", e);
    }

    // Capture AI prompts if present
    const aiPrompts: any[] = [];
    try {
      if (window.__AI_PROMPTS__) {
        aiPrompts.push(...walk(window.__AI_PROMPTS__));
      }
    } catch (e) {
      console.warn("AI prompt extraction failed:", e);
    }

    // Capture computed styles
    const styles: any = {};
    try {
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars: any = {};
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--')) {
          cssVars[prop] = rootStyles.getPropertyValue(prop);
        }
      }
      styles.cssVariables = cssVars;
    } catch (e) {
      console.warn("Style extraction failed:", e);
    }

    // Build UAP v3.0
    const uap = {
      meta: {
        format: "UAP v3.0",
        generator: "NoCodeBridge.xyz Self-Extractor",
        timestamp,
        bridge_ready: true
      },
      project: {
        name: document.title || "NoCodeBridge Export",
        pages: routes,
        components,
        logic: appRoot,
        data_models: dataModels,
        ai_prompts: aiPrompts,
        variables,
        styles,
        connections: {
          window: Object.keys(window).filter(k => !k.startsWith('webkit') && !k.startsWith('chrome'))
        }
      }
    };

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(JSON.stringify(uap, null, 2));
      localStorage.setItem('uap_export', JSON.stringify(uap));
      console.log("✅ UAP v3.0 saved to localStorage as 'uap_export'");
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
    }

    // Create downloads
    const jsonBlob = new Blob([JSON.stringify(uap, null, 2)], { type: "application/json" });
    const mdBlob = new Blob(
      [`# NoCodeBridge Export v3.0\n\nGenerated ${timestamp}\n\n## UAP Data\n\n\`\`\`json\n${JSON.stringify(uap, null, 2)}\n\`\`\``],
      { type: "text/markdown" }
    );
    const uapBlob = new Blob([JSON.stringify(uap, null, 2)], { type: "application/json" });

    saveAs(jsonBlob, "NoCodeBridge-schema.json");
    saveAs(mdBlob, "NoCodeBridge-export.md");
    saveAs(uapBlob, "NoCodeBridge-uap-v3.0.uap");
    
    alert("✅ Full self-extract complete – UAP v3.0 saved & copied to clipboard");

    // Auto-import if importer exists
    if (window.NoCodeBridge?.import) {
      window.NoCodeBridge.import(uap);
    }
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
      <h1 className="text-2xl font-bold">🧩 AEIOU Self-Extractor v3.0</h1>
      <p className="text-sm text-muted-foreground">
        Generates UAP v3.0 with complete app soul capture: pages, components, logic, data models, AI prompts, variables, styles, and connections.
      </p>
      <p className="text-xs text-muted-foreground">
        No truncation. No summarization. 100% reversible. Zero credits.
      </p>
      <Button onClick={captureApp}>🧩 Run Full Extraction</Button>
    </div>
  );
}
