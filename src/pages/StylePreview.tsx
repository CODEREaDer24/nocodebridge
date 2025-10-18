import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const StylePreview = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,hsl(var(--gono-navy)),hsl(var(--gono-blue)))] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Rotating AEIOU Icon */}
        <div className="fixed top-8 right-8 w-16 h-16 flex items-center justify-center">
          <div className="animate-spin-slow text-[hsl(var(--gono-lime))] text-4xl font-bold">
            ⭕
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <CardTitle className="text-3xl font-['Outfit'] mb-2">
              Go No Code Mode Co (GoNoCoMoCo)
            </CardTitle>
            <CardDescription className="text-base font-['Inter'] italic">
              Powered by AEIOU Framework — Artificial Enhancement, Interoperability, Optimization, Unification
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Color Palette */}
            <div>
              <h3 className="text-xl font-['Outfit'] font-semibold mb-4">🎨 Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[hsl(var(--gono-navy))] border border-white/20"></div>
                  <p className="text-sm font-['Inter']">Deep Navy</p>
                  <p className="text-xs text-muted-foreground">#0A0F1C</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[hsl(var(--gono-blue))] border border-white/20"></div>
                  <p className="text-sm font-['Inter']">Electric Blue</p>
                  <p className="text-xs text-muted-foreground">#3B82F6</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[hsl(var(--gono-lime))] border border-white/20"></div>
                  <p className="text-sm font-['Inter']">Vibrant Lime</p>
                  <p className="text-xs text-muted-foreground">#B4FF4F</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-[hsl(var(--gono-coral))] border border-white/20"></div>
                  <p className="text-sm font-['Inter']">Coral Accent</p>
                  <p className="text-xs text-muted-foreground">#FF6F61</p>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-xl font-['Outfit'] font-semibold mb-4">🔤 Typography</h3>
              <div className="space-y-2">
                <p className="text-2xl font-['Outfit'] font-bold">Outfit (Headings)</p>
                <p className="text-base font-['Inter']">Inter (Body) — Clean, readable, and modern</p>
              </div>
            </div>

            {/* Example Buttons */}
            <div>
              <h3 className="text-xl font-['Outfit'] font-semibold mb-4">🧩 Example Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-[hsl(var(--gono-blue))] hover:bg-[hsl(var(--gono-blue))]/90 text-white shadow-[0_0_20px_hsl(var(--gono-blue))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-blue))/0.5] transition-all"
                >
                  Primary Action
                </Button>
                <Button 
                  variant="secondary"
                  className="bg-[hsl(var(--gono-lime))]/20 hover:bg-[hsl(var(--gono-lime))]/30 text-[hsl(var(--gono-lime))] border border-[hsl(var(--gono-lime))]/50 shadow-[0_0_15px_hsl(var(--gono-lime))/0.2] hover:shadow-[0_0_25px_hsl(var(--gono-lime))/0.4] transition-all"
                >
                  Secondary Action
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-[hsl(var(--gono-coral))] hover:bg-[hsl(var(--gono-coral))]/90 text-white shadow-[0_0_20px_hsl(var(--gono-coral))/0.3] hover:shadow-[0_0_30px_hsl(var(--gono-coral))/0.5] transition-all"
                >
                  Destructive
                </Button>
              </div>
            </div>

            {/* AEIOU Flow */}
            <div>
              <h3 className="text-xl font-['Outfit'] font-semibold mb-4">💡 Example AEIOU Flow</h3>
              <div className="flex items-center justify-center gap-4 p-6 bg-background/50 rounded-lg border border-white/10">
                {['A', 'E', 'I', 'O', 'U'].map((letter, index) => (
                  <div key={letter} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--gono-blue))] flex items-center justify-center text-white font-['Outfit'] font-bold text-xl shadow-[0_0_20px_hsl(var(--gono-blue))/0.4]">
                      {letter}
                    </div>
                    {index < 4 && (
                      <div className="text-[hsl(var(--gono-lime))] text-2xl">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-sm font-['Inter'] text-muted-foreground">
                GoNoCoMoCo | Build smarter, ship faster, spend fewer credits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StylePreview;
