import React, { useState } from "react";
import { toast } from "sonner";

// 🔄 Universal Parser
function parseAnything(fileText: string, fileName = "Unknown") {
  let detected = "Plain Text";
  try {
    const json = JSON.parse(fileText);
    detected = json.meta?.format || "JSON";

    const projectName =
      json.projectName ||
      json.name ||
      json.meta?.projectName ||
      "Unnamed Project";

    const description =
      json.description ||
      json.meta?.description ||
      "No description provided.";

    const pagesCount = json.pages?.length || 0;
    const componentsCount = json.components?.length || 0;

    const md = `# ${projectName}\n\n${description}\n\nPages: ${pagesCount}\nComponents: ${componentsCount}\n\n---\nGenerated: ${new Date().toLocaleString()}`;

    return { markdown: md, name: projectName, detected };
  } catch {
    const title =
      fileText.match(/^# (.+)$/m)?.[1]?.trim() ||
      fileName.replace(/\.[^/.]+$/, "") ||
      "ImportedText";
    return { markdown: fileText.slice(0, 4000), name: title, detected };
  }
}

export default function Import() {
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState("None");
  const [fileName, setFileName] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    try {
      const { markdown, name, detected } = parseAnything(text, file.name);
      setOutput(markdown);
      setDetected(detected);
      setFileName(name);
      toast.success(`✅ Imported ${detected} file`);
    } catch (err) {
      toast.error("❌ Could not analyze file");
      setOutput("");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">📥 Import Project</h1>
      <p className="text-gray-400 mb-6 text-center">
        Upload any <b>.uap</b>, <b>.json</b>, <b>.md</b>, or <b>.txt</b> file to view or convert it.
      </p>

      <input
        type="file"
        accept=".uap,.json,.md,.txt"
        onChange={handleUpload}
        className="cursor-pointer bg-blue-900/40 px-4 py-2 rounded-lg hover:bg-blue-900/60 transition mb-6"
      />

      {output ? (
        <>
          <div className="text-sm mb-2 text-gray-400">
            <b>Detected Format:</b> {detected}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full max-w-3xl h-96 bg-[#111826] text-blue-100 text-xs p-4 rounded-lg mb-4"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            📋 Copy Output
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-sm mt-10">
          ⚙️ Ready to import files from Extractor or AI. No credits used.
        </p>
      )}
    </div>
  );
}
