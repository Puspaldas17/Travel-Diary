import { useEffect, useState } from "react";
import { Trip, SyncTripsResponse } from "@shared/api";
import { getTrips, markSynced, removeTrip, setTrips } from "@/lib/trips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function Trips() {
  const [trips, setLocalTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalTrips(getTrips());
  }, []);

  const syncTrip = async (trip: Trip) => {
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });
      if (res.ok) {
        markSynced(trip.id);
        setLocalTrips(getTrips());
        toast.success("Trip synced");
      } else {
        toast.info("Server unavailable, kept locally");
      }
    } catch {
      toast.info("Offline or server error, kept locally");
    }
  };

  const syncAll = async () => {
    setLoading(true);
    const unsynced = getTrips().filter((t) => !t.syncedAt);
    if (!unsynced.length) {
      toast("All trips are already synced");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/trips/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trips: unsynced }),
      });
      if (res.ok) {
        const data = (await res.json()) as SyncTripsResponse;
        data.syncedIds.forEach(markSynced);
        setLocalTrips(getTrips());
        toast.success("Synced pending trips");
      } else {
        toast.info("Server unavailable, kept locally");
      }
    } catch {
      toast.info("Offline or server error, kept locally");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTrips([]);
    setLocalTrips([]);
    toast.success("Cleared all trips");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Trips</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={syncAll} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Sync All
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => (
          <Card key={t.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Trip #{t.tripNumber}</CardTitle>
              {t.syncedAt ? (
                <Badge className="bg-emerald-500">Synced</Badge>
              ) : (
                <Badge variant="secondary">Local</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">From:</span> {t.origin}
              </div>
              <div>
                <span className="font-medium">To:</span> {t.destination}
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="font-medium">Mode:</span> {t.mode}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {new Date(t.departureTime).toLocaleString()}
                </div>
              </div>
              {!!t.companions?.length && (
                <div>
                  <span className="font-medium">Companions:</span> {t.companions.length}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => syncTrip(t)} disabled={!!t.syncedAt}>
                  <UploadCloud className="h-4 w-4 mr-2" /> Sync
                </Button>
                <Button size="sm" variant="outline" onClick={() => { removeTrip(t.id); setLocalTrips(getTrips()); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!trips.length && (
        <div className="text-center text-muted-foreground py-24">No trips yet. Capture your first trip from Home.</div>
      )}
    </div>
  );
}
