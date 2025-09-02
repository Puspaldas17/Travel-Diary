import { Clock, Sparkles, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="container pt-8 pb-4">
      <div className="rounded-2xl bg-card border p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              NATPAC Travel Diary
            </h1>
            <p className="text-muted-foreground max-w-prose">
              Capture trip details like origin, time, mode, destination and accompanying travellers. Your consent is required. Data is stored locally and can be synced to the server for planning purposes.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><Sparkles className="h-4 w-4" /> Auto-detect location</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><Clock className="h-4 w-4" /> Quick time set</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><Users className="h-4 w-4" /> Companions</span>
            </div>
          </div>
          <div className="flex-1">
            <img src="/placeholder.svg" alt="Travel" className="w-full h-44 md:h-56 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
