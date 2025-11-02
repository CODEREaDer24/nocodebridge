import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BridgeNavigation from "@/components/BridgeNavigation";
import BridgeFooter from "@/components/BridgeFooter";

interface StoredUAP {
  key: string;
  timestamp: string;
  size: number;
}

const Admin = () => {
  const [uaps, setUaps] = useState<StoredUAP[]>([]);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadUAPs();
    loadStats();
  }, []);

  const loadUAPs = () => {
    const stored: StoredUAP[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('uap_') || key.includes('export') || key.includes('import'))) {
        const value = localStorage.getItem(key);
        if (value) {
          stored.push({
            key,
            timestamp: new Date().toISOString(), // In real app, store timestamp with data
            size: new Blob([value]).size
          });
        }
      }
    }
    setUaps(stored);
  };

  const loadStats = () => {
    const uploadsCount = parseInt(localStorage.getItem('stats_uploads') || '0');
    const downloadsCount = parseInt(localStorage.getItem('stats_downloads') || '0');
    setStats({ uploads: uploadsCount, downloads: downloadsCount });
  };

  const handleDelete = (key: string) => {
    if (confirm(`Delete ${key}?`)) {
      localStorage.removeItem(key);
      loadUAPs();
      toast({
        title: "Deleted",
        description: `Removed ${key} from storage`,
      });
    }
  };

  const handleDownload = (key: string) => {
    const data = localStorage.getItem(key);
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}.json`;
      a.click();
      
      const newDownloads = stats.downloads + 1;
      localStorage.setItem('stats_downloads', newDownloads.toString());
      setStats({ ...stats, downloads: newDownloads });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      <BridgeNavigation />
      
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-lime-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-8 relative z-10 max-w-6xl">{/* Header */}
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button asChild variant="outline" className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10 rounded-xl">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#111826]/80 backdrop-blur-sm border-cyan-500/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Total Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-cyan-400">{stats.uploads}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111826]/80 backdrop-blur-sm border-violet-500/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-violet-400">{stats.downloads}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent UAPs */}
        <Card className="bg-[#111826]/80 backdrop-blur-sm border-lime-500/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Recent UAPs</CardTitle>
          </CardHeader>
          <CardContent>
            {uaps.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No UAPs stored yet</p>
            ) : (
              <div className="space-y-3">
                {uaps.map((uap) => (
                  <div
                    key={uap.key}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10 hover:border-lime-400/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-lime-400" />
                      <div>
                        <p className="text-white font-medium">{uap.key}</p>
                        <p className="text-xs text-gray-400">{formatBytes(uap.size)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(uap.key)}
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(uap.key)}
                        size="sm"
                        variant="destructive"
                        className="rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer */}
        <BridgeFooter />
      </div>
    </div>
  );
};

export default Admin;
