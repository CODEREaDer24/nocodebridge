import React, { useState } from "react";
import { toast } from "sonner";

export default function Export() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("exported-project.uap");

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((text) => {
      setInput(text);
      toast.success(`Loaded ${file.name}`);
    });
  }

  function convertToUAP() {
    if (!input.trim()) {
      toast.error("Nothing to export!");
      return;
    }

    const isJSON = input.trim().startsWith("{");
    let uapData;

    try {
      if (isJSON) {
        const parsed = JSON.parse(input);
        uapData = {
          meta: {
            format: "UAP",
            version: "1.0.0",
            generated_at: new Date().toISOString(),
            source: "GoNoCoMoCo / AEIOU Export Tool",
            projectName:
              parsed.meta?.name ||
              parsed.name ||
              parsed.projectName ||
              "Unnamed Project",
          },
          name:
            parsed.name || parsed.meta?.name || "Unnamed Project",
          description:
            parsed.description ||
            parsed.meta?.description ||
            "No description provided.",
          pages: parsed.pages || [],
          components: parsed.components || [],
          raw: parsed,
        };
      } else {
        uapData = {
          meta: {
            format: "UAP",
            version: "1.0.0",
            generated_at: new Date().toISOString(),
            source: "GoNoCoMoCo / AEIOU Markdown Export",
            projectName: fileName.replace(".uap", ""),
          },
          name: fileName.replace(".uap", ""),
          description: "Converted from Markdown",
          markdown: input,
          pages: [],
          components: [],
        };
      }

      const blob = new Blob([JSON.stringify(uapData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("✅ Exported successfully!");
    } catch (err) {
      toast.error("❌ Failed to convert file");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">📤 Export Project</h1>
      <p className="text-gray-400 mb-6 text-center">
        Paste Markdown or upload a file to convert it into a <b>.uap</b> export.
      </p>

      <input
        type="file"
        accept=".md,.json,.txt"
        onChange={handleFile}
        className="cursor-pointer bg-blue-900/40 px-4 py-2 rounded-lg hover:bg-blue-900/60 transition mb-4"
      />

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste Markdown or JSON here..."
        className="w-full max-w-3xl h-80 bg-[#111826] text-blue-100 text-xs p-4 rounded-lg mb-4"
      />

      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-full max-w-3xl bg-[#111826] text-blue-200 text-sm px-4 py-2 rounded mb-4"
      />

      <button
        onClick={convertToUAP}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        🔄 Generate .UAP File
      </button>

      <p className="text-gray-500 text-sm mt-8">
        ⚙️ Local-only conversion (safe, no credits used)
      </p>
    </div>
  );
}
