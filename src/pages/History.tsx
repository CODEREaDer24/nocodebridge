import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trash2, Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: string;
  idea: string;
  schema: any;
  timestamp: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = localStorage.getItem("appHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("appHistory");
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All saved items have been removed",
    });
  };

  const handleLoadSchema = (item: HistoryItem) => {
    localStorage.setItem("currentSchema", JSON.stringify(item.schema));
    navigate("/schema");
    toast({
      title: "Schema loaded",
      description: "You can now view and edit it",
    });
  };

  const handleDelete = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("appHistory", JSON.stringify(updated));
    toast({
      title: "Item deleted",
      description: "History item removed",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">History</h1>
              <p className="text-sm text-muted-foreground">
                View your previous generated apps
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={handleClearHistory} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No history yet. Start by generating an app!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <Card key={item.id} className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.schema.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.idea}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => handleLoadSchema(item)}
                      size="sm"
                      className="gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Load Schema
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          Export. Teleport. Collaborate. — AEIOU by GoNoCoMoCo
        </div>
      </div>
    </div>
  );
};

export default History;