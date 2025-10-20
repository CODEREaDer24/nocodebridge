// NoCodeBridge Rebuilder Hook
// Attach to window for auto-execution after import

export function rebuild(uapImport: any) {
  const p = uapImport.project || {};
  console.log("🧠 NoCodeBridge Rebuilding:", p.name);
  
  const summary = {
    status: "rebuilt",
    project: p.name,
    pages: p.pages?.length || 0,
    components: p.components?.length || 0,
    data_models: p.data_models?.length || 0,
    ai_prompts: p.ai_prompts?.length || 0,
    timestamp: new Date().toISOString()
  };

  console.table(summary);
  
  // Store rebuild result
  localStorage.setItem('uap_rebuild_result', JSON.stringify(summary));
  
  return summary;
}

// Auto-attach to window
if (typeof window !== 'undefined') {
  (window as any).NoCodeBridge = {
    ...(window as any).NoCodeBridge,
    rebuild,
    import: (uap: any) => {
      console.log("🔄 NoCodeBridge auto-import triggered");
      localStorage.setItem('uap_import', JSON.stringify(uap));
      return rebuild(uap);
    }
  };
}
