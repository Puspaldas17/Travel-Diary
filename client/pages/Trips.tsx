import { useEffect, useState } from "react";
import { Trip, SyncTripsResponse } from "@shared/api";
import { getTrips, markSynced, removeTrip, setTrips } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TripCard from "@/components/trips/TripCard";

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

  const handleDelete = (id: string) => {
    removeTrip(id);
    setLocalTrips(getTrips());
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
          <TripCard key={t.id} trip={t} onSync={syncTrip} onDelete={handleDelete} />
        ))}
      </div>

      {!trips.length && (
        <div className="text-center text-muted-foreground py-24">No trips yet. Capture your first trip from Home.</div>
      )}
    </div>
  );
}
