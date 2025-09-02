import { Trip } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud } from "lucide-react";

interface Props {
  trip: Trip;
  onSync: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

export default function TripCard({ trip, onSync, onDelete }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Trip #{trip.tripNumber}</CardTitle>
        {trip.syncedAt ? (
          <Badge className="bg-emerald-500">Synced</Badge>
        ) : (
          <Badge variant="secondary">Local</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="font-medium">From:</span> {trip.origin}
        </div>
        <div>
          <span className="font-medium">To:</span> {trip.destination}
        </div>
        <div className="flex gap-4">
          <div>
            <span className="font-medium">Mode:</span> {trip.mode}
          </div>
          <div>
            <span className="font-medium">Time:</span>{" "}
            {new Date(trip.departureTime).toLocaleString()}
          </div>
        </div>
        {!!trip.companions?.length && (
          <div>
            <span className="font-medium">Companions:</span>{" "}
            {trip.companions.length}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onSync(trip)}
            disabled={!!trip.syncedAt}
          >
            <UploadCloud className="h-4 w-4 mr-2" /> Sync
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(trip.id)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
