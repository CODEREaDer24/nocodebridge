import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface JSONViewerProps {
  data: any;
  level?: number;
}

export const JSONViewer = ({ data, level = 0 }: JSONViewerProps) => {
  const [expanded, setExpanded] = useState(level < 2);

  if (data === null) {
    return <span className="text-gray-500">null</span>;
  }

  if (typeof data !== "object") {
    const valueClass =
      typeof data === "string"
        ? "text-green-600"
        : typeof data === "number"
        ? "text-blue-600"
        : typeof data === "boolean"
        ? "text-purple-600"
        : "text-gray-700";
    
    return (
      <span className={valueClass}>
        {typeof data === "string" ? `"${data}"` : String(data)}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data : Object.entries(data);
  const isEmpty = entries.length === 0;

  if (isEmpty) {
    return <span className="text-gray-500">{isArray ? "[]" : "{}"}</span>;
  }

  return (
    <div className="font-mono text-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-gray-600" />
        ) : (
          <ChevronRight className="h-3 w-3 text-gray-600" />
        )}
        <span className="text-gray-700 font-semibold">
          {isArray ? `Array[${entries.length}]` : `Object{${entries.length}}`}
        </span>
      </button>
      
      {expanded && (
        <div className="ml-4 border-l-2 border-gray-200 pl-3 mt-1">
          {isArray
            ? entries.map((item: any, index: number) => (
                <div key={index} className="py-1">
                  <span className="text-gray-500">{index}: </span>
                  <JSONViewer data={item} level={level + 1} />
                </div>
              ))
            : entries.map(([key, value]: [string, any]) => (
                <div key={key} className="py-1">
                  <span className="text-blue-700 font-medium">{key}: </span>
                  <JSONViewer data={value} level={level + 1} />
                </div>
              ))}
        </div>
      )}
    </div>
  );
};
