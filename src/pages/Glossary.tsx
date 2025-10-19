import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const glossaryTerms = [
  {
    term: "JSON",
    definition: "The structural language of your app — a machine-readable format that defines how data and components are organized."
  },
  {
    term: "Markdown",
    definition: "Readable explanation format — plain-English documentation that humans can easily understand."
  },
  {
    term: "UAP",
    definition: "Universal App Package — your app's soul in one file. Contains both JSON structure and Markdown documentation."
  },
  {
    term: "UAP-Imp",
    definition: "An upgraded UAP with improvements — created when AI tools suggest enhancements (coming soon)."
  },
  {
    term: "AEIOU",
    definition: "App Extraction, Integration & Optimization Utility — the framework behind NoCodeBridge's round-trip workflow."
  },
  {
    term: "Schema",
    definition: "Blueprint of how data is organized — defines tables, fields, and relationships in your app's database."
  },
  {
    term: "Routes",
    definition: "Paths between pages — the navigation structure that connects different parts of your app."
  },
  {
    term: "API",
    definition: "How apps talk to each other — Application Programming Interface that enables data exchange between systems."
  }
];

const Glossary = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📘 GoNoCoMoCo Glossary
          </h1>
          <p className="text-xl text-purple-300">
            Speak No-Code Like a Pro
          </p>
        </div>

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {glossaryTerms.map((item, index) => (
            <Card 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/60 transition-all"
            >
              <CardHeader>
                <CardTitle className="text-purple-400 text-xl">
                  {item.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base">
                  {item.definition}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            Need help? Ask <b className="text-purple-400">Chad G. Petit (ChatGPT)</b> anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Glossary;